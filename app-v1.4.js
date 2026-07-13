document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const sourceCrs = $("source-crs"), targetCrs = $("target-crs");
  const sourceZone = $("source-zone"), targetZone = $("target-zone");
  const sourceHemisphere = $("source-hemisphere"), targetHemisphere = $("target-hemisphere");
  const xInput = $("x"), yInput = $("y");
  const result = $("result"), message = $("message");

  if (typeof proj4 === "undefined") {
    message.textContent = "The transformation library could not be loaded.";
    message.className = "message error";
    return;
  }

  proj4.defs("EPSG:2039",
    "+proj=tmerc +lat_0=31.7343936111111 +lon_0=35.2045169444444 " +
    "+k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 " +
    "+towgs84=23.772,17.49,17.859,-0.3132,-1.85274,1.67299,-5.4262 " +
    "+units=m +no_defs +type=crs");

  proj4.defs("EPSG:28193",
    "+proj=cass +lat_0=31.7340969444444 +lon_0=35.2120805555556 " +
    "+x_0=170251.555 +y_0=1126867.909 +a=6378300.789 +b=6356566.435 " +
    "+towgs84=-275.7224,94.7824,340.8944,-8.001,-4.42,-11.821,1 " +
    "+units=m +no_defs +type=crs");

  const AREA = { west: 34.17, south: 29.45, east: 35.69, north: 33.28 };
  const RULES = {
    "EPSG:2039": {
      name: "Israeli TM Grid (ITM)", xMin: 119097.33, xMax: 266563.36,
      yMin: 373609.64, yMax: 798747.07
    },
    "EPSG:28193": {
      name: "Israeli Old Grid (ICS)", xMin: 69099.91, xMax: 216561.80,
      yMin: 873606.74, yMax: 1298746.25
    }
  };

  function fillZones(select) {
    for (let z = 1; z <= 60; z++) {
      const option = document.createElement("option");
      option.value = String(z); option.textContent = String(z);
      if (z === 36) option.selected = true;
      select.appendChild(option);
    }
  }
  fillZones(sourceZone); fillZones(targetZone);

  function setMessage(text, type) {
    message.textContent = text;
    message.className = "message" + (type ? " " + type : "");
  }

  function clearResult() {
    result.classList.add("is-hidden");
    setMessage("", "");
  }

  function parseValue(raw) {
    const n = Number(raw.trim().replace(/\s+/g, "").replace(",", "."));
    if (!Number.isFinite(n)) throw new Error("Enter valid numeric values for both coordinates.");
    return n;
  }

  function within(value, min, max, tolerance = 0) {
    return value >= min - tolerance && value <= max + tolerance;
  }

  function normaliseLongitude(lon) {
    if (lon === 180) return 180;
    return ((lon + 180) % 360 + 360) % 360 - 180;
  }

  function standardZoneFromLongitude(lon) {
    const normalised = normaliseLongitude(lon);
    if (normalised === 180) return 60;
    return Math.floor((normalised + 180) / 6) + 1;
  }

  function utmZoneForLocation(lon, lat) {
    lon = normaliseLongitude(lon);
    if (lat >= 56 && lat < 64 && lon >= 3 && lon < 12) return 32;
    if (lat >= 72 && lat < 84) {
      if (lon >= 0 && lon < 9) return 31;
      if (lon >= 9 && lon < 21) return 33;
      if (lon >= 21 && lon < 33) return 35;
      if (lon >= 33 && lon < 42) return 37;
    }
    return standardZoneFromLongitude(lon);
  }

  function hemisphereForLatitude(lat) { return lat >= 0 ? "N" : "S"; }

  function zoneLongitudeRange(zone) {
    const west = -180 + (zone - 1) * 6;
    return { west, east: west + 6 };
  }

  function updateZoneHelp(side) {
    const zone = Number(side === "source" ? sourceZone.value : targetZone.value);
    const range = zoneLongitudeRange(zone);
    $(side + "-zone-help").textContent =
      `Standard zone ${zone} spans ${range.west}° to ${range.east}° longitude.`;
  }

  function createUtm(zone, hemisphere) {
    const code = `CUSTOM:UTM${zone}${hemisphere}`;
    proj4.defs(code,
      `+proj=utm +zone=${zone}${hemisphere === "S" ? " +south" : ""} ` +
      "+datum=WGS84 +units=m +no_defs +type=crs");
    return code;
  }

  function selectedCrs(side) {
    const selected = side === "source" ? sourceCrs.value : targetCrs.value;
    if (selected !== "UTM") return selected;
    const zone = Number(side === "source" ? sourceZone.value : targetZone.value);
    const hem = side === "source" ? sourceHemisphere.value : targetHemisphere.value;
    return createUtm(zone, hem);
  }

  function validateGeographic(lon, lat, forUtm = false) {
    if (!within(lon, -180, 180)) throw new Error("Longitude must be between -180 and 180 degrees.");
    if (!within(lat, -90, 90)) throw new Error("Latitude must be between -90 and 90 degrees.");
    if (forUtm && (lat < -80 || lat > 84)) {
      throw new Error("UTM is normally used only between 80°S and 84°N.");
    }
  }

  function validateIsraeliGrid(x, y, code) {
    const r = RULES[code];
    const valid = within(x, r.xMin, r.xMax) && within(y, r.yMin, r.yMax);
    if (valid) return;

    const swapped = within(y, r.xMin, r.xMax) && within(x, r.yMin, r.yMax);
    if (swapped) {
      throw new Error(`${r.name}: the values appear reversed. Enter Easting first and Northing second.`);
    }

    throw new Error(
      `${r.name}: coordinate outside the expected area-of-use bounds. ` +
      `Easting should be approximately ${Math.round(r.xMin).toLocaleString()}–${Math.round(r.xMax).toLocaleString()} m; ` +
      `Northing ${Math.round(r.yMin).toLocaleString()}–${Math.round(r.yMax).toLocaleString()} m.`
    );
  }

  function validateUtmNumbers(easting, northing) {
    if (within(easting, 100000, 900000) && within(northing, 0, 10000000)) return;

    if (within(northing, 100000, 900000) && within(easting, 0, 10000000)) {
      throw new Error("UTM: the values may be reversed. Enter Easting first and Northing second.");
    }

    throw new Error(
      "UTM coordinate is implausible. Easting should normally be about 100,000–900,000 m " +
      "and Northing 0–10,000,000 m."
    );
  }

  function isInsideIsraelArea(lon, lat) {
    return within(lon, AREA.west, AREA.east, 0.02) &&
           within(lat, AREA.south, AREA.north, 0.02);
  }

  function inputToWgs84(x, y) {
    const source = selectedCrs("source");
    if (sourceCrs.value === "EPSG:4326") return [x, y];
    const point = proj4(source, "EPSG:4326", [x, y]);
    if (!point || !Number.isFinite(point[0]) || !Number.isFinite(point[1])) {
      throw new Error("The input could not be resolved to a valid geographic location.");
    }
    validateGeographic(point[0], point[1], sourceCrs.value === "UTM");
    return point;
  }

  function validateSourceArea(lon, lat) {
    if (sourceCrs.value === "EPSG:2039" || sourceCrs.value === "EPSG:28193") {
      if (!isInsideIsraelArea(lon, lat)) {
        const name = RULES[sourceCrs.value].name;
        throw new Error(
          `${name}: this coordinate resolves outside the CRS area of use ` +
          `(approximately 34.17°–35.69°E and 29.45°–33.28°N).`
        );
      }
    }

    if (sourceCrs.value === "UTM") {
      const expectedZone = utmZoneForLocation(lon, lat);
      const expectedHemisphere = hemisphereForLatitude(lat);
      const chosenZone = Number(sourceZone.value);
      const chosenHemisphere = sourceHemisphere.value;
      if (chosenZone !== expectedZone || chosenHemisphere !== expectedHemisphere) {
        throw new Error(
          `The entered UTM coordinate resolves to ${lon.toFixed(5)}°, ${lat.toFixed(5)}°, ` +
          `which belongs to zone ${expectedZone}${expectedHemisphere}, not ` +
          `${chosenZone}${chosenHemisphere}. Check zone, hemisphere, and coordinate order.`
        );
      }
    }
  }

  function validateTargetArea(lon, lat) {
    if (targetCrs.value === "EPSG:2039" || targetCrs.value === "EPSG:28193") {
      if (!isInsideIsraelArea(lon, lat)) {
        const name = RULES[targetCrs.value].name;
        throw new Error(`${name} is defined for Israel and Palestine onshore; the input is outside its area of use.`);
      }
    }
  }

  function validateOrSetTargetUtm(lon, lat) {
    if (targetCrs.value !== "UTM") return;
    validateGeographic(lon, lat, true);
    const correctZone = utmZoneForLocation(lon, lat);
    const correctHemisphere = hemisphereForLatitude(lat);

    if ($("auto-target-utm").checked) {
      targetZone.value = String(correctZone);
      targetHemisphere.value = correctHemisphere;
      updateZoneHelp("target");
      return;
    }

    const chosenZone = Number(targetZone.value);
    const chosenHemisphere = targetHemisphere.value;
    if (chosenZone !== correctZone || chosenHemisphere !== correctHemisphere) {
      throw new Error(
        `This location belongs to UTM zone ${correctZone}${correctHemisphere}, ` +
        `not ${chosenZone}${chosenHemisphere}. Enable automatic selection or correct the settings.`
      );
    }
  }

  function validateRoundTrip(source, target, input, output) {
    const returned = proj4(target, source, output);
    if (!returned || !Number.isFinite(returned[0]) || !Number.isFinite(returned[1])) {
      throw new Error("The transformation failed its consistency check.");
    }
    const tolerance = sourceCrs.value === "EPSG:4326" ? 1e-7 : 0.1;
    if (Math.abs(returned[0] - input[0]) > tolerance || Math.abs(returned[1] - input[1]) > tolerance) {
      throw new Error("The transformation failed the round-trip consistency check. Verify the CRS and input values.");
    }
  }

  function updateControls() {
    $("source-utm-options").classList.toggle("is-hidden", sourceCrs.value !== "UTM");
    $("target-utm-options").classList.toggle("is-hidden", targetCrs.value !== "UTM");
    const geo = sourceCrs.value === "EPSG:4326";
    $("x-label").textContent = geo ? "Longitude / X" : "Easting / X";
    $("y-label").textContent = geo ? "Latitude / Y" : "Northing / Y";
    clearResult();
  }

  function autoPreviewTargetZone() {
    if (sourceCrs.value !== "EPSG:4326" || targetCrs.value !== "UTM" || !$("auto-target-utm").checked) return;
    try {
      const lon = parseValue(xInput.value), lat = parseValue(yInput.value);
      validateGeographic(lon, lat, true);
      targetZone.value = String(utmZoneForLocation(lon, lat));
      targetHemisphere.value = hemisphereForLatitude(lat);
      updateZoneHelp("target");
    } catch (_) {}
  }

  function convert() {
    clearResult();
    try {
      const x = parseValue(xInput.value), y = parseValue(yInput.value);

      if (sourceCrs.value === "EPSG:4326") validateGeographic(x, y, targetCrs.value === "UTM");
      if (sourceCrs.value === "EPSG:2039" || sourceCrs.value === "EPSG:28193") {
        validateIsraeliGrid(x, y, sourceCrs.value);
      }
      if (sourceCrs.value === "UTM") validateUtmNumbers(x, y);

      const geographic = inputToWgs84(x, y);
      const lon = geographic[0], lat = geographic[1];
      validateSourceArea(lon, lat);
      validateTargetArea(lon, lat);
      validateOrSetTargetUtm(lon, lat);

      const source = selectedCrs("source");
      const target = selectedCrs("target");
      if (source === target) throw new Error("The source and target coordinate systems are identical.");

      const converted = proj4(source, target, [x, y]);
      if (!converted || !Number.isFinite(converted[0]) || !Number.isFinite(converted[1])) {
        throw new Error("The transformation did not return a valid coordinate.");
      }

      if (targetCrs.value === "EPSG:2039" || targetCrs.value === "EPSG:28193") {
        validateIsraeliGrid(converted[0], converted[1], targetCrs.value);
      }
      if (targetCrs.value === "UTM") validateUtmNumbers(converted[0], converted[1]);

      validateRoundTrip(source, target, [x, y], converted);

      const targetIsGeo = targetCrs.value === "EPSG:4326";
      const label =
        targetCrs.value === "UTM" ? `WGS 84 / UTM zone ${targetZone.value}${targetHemisphere.value}` :
        targetCrs.value === "EPSG:4326" ? "WGS 84 — EPSG:4326" :
        targetCrs.value === "EPSG:2039" ? "Israeli TM Grid — EPSG:2039" :
        "Israeli Old Grid — EPSG:28193";

      $("result-crs").textContent = label;
      $("result-x-label").textContent = targetIsGeo ? "Longitude" : "Easting";
      $("result-y-label").textContent = targetIsGeo ? "Latitude" : "Northing";
      $("result-x").textContent = targetIsGeo ? converted[0].toFixed(7) : converted[0].toFixed(3);
      $("result-y").textContent = targetIsGeo ? converted[1].toFixed(7) : converted[1].toFixed(3);
      result.classList.remove("is-hidden");
      setMessage("The coordinate was converted and validated successfully.", "success");
    } catch (error) {
      setMessage(error.message || "An unexpected validation error occurred.", "error");
    }
  }

  sourceCrs.addEventListener("change", updateControls);
  targetCrs.addEventListener("change", function(){ updateControls(); autoPreviewTargetZone(); });
  sourceZone.addEventListener("change", function(){ updateZoneHelp("source"); clearResult(); });
  targetZone.addEventListener("change", function(){ updateZoneHelp("target"); clearResult(); });
  sourceHemisphere.addEventListener("change", clearResult);
  targetHemisphere.addEventListener("change", clearResult);
  $("auto-target-utm").addEventListener("change", function(){ clearResult(); autoPreviewTargetZone(); });
  xInput.addEventListener("input", autoPreviewTargetZone);
  yInput.addEventListener("input", autoPreviewTargetZone);

  $("convert").addEventListener("click", convert);
  $("swap").addEventListener("click", function () {
    const a = sourceCrs.value; sourceCrs.value = targetCrs.value; targetCrs.value = a;
    const z = sourceZone.value; sourceZone.value = targetZone.value; targetZone.value = z;
    const h = sourceHemisphere.value; sourceHemisphere.value = targetHemisphere.value; targetHemisphere.value = h;
    updateControls();
  });
  $("copy").addEventListener("click", async function () {
    try {
      await navigator.clipboard.writeText($("result-x").textContent + ", " + $("result-y").textContent);
      setMessage("The converted coordinate was copied.", "success");
    } catch (_) {
      setMessage("Copying failed. Copy the values manually.", "error");
    }
  });

  [xInput, yInput].forEach(el => el.addEventListener("keydown", e => { if (e.key === "Enter") convert(); }));
  updateControls(); updateZoneHelp("source"); updateZoneHelp("target");
});
