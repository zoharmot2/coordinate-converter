document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const MAX_ROWS = 50000;
  const PREVIEW_ROWS = 10;
  const $ = (id) => document.getElementById(id);

  if (typeof proj4 === "undefined") {
    document.body.innerHTML = "<p>The transformation library could not be loaded.</p>";
    return;
  }
  if (typeof XLSX === "undefined") {
    document.body.innerHTML = "<p>The spreadsheet library could not be loaded.</p>";
    return;
  }
  if (typeof L === "undefined") {
    document.body.innerHTML = "<p>The map library could not be loaded.</p>";
    return;
  }

  proj4.defs(
    "EPSG:2039",
    "+proj=tmerc +lat_0=31.7343936111111 +lon_0=35.2045169444444 " +
    "+k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 " +
    "+towgs84=23.772,17.49,17.859,-0.3132,-1.85274,1.67299,-5.4262 " +
    "+units=m +no_defs +type=crs"
  );

  proj4.defs(
    "EPSG:28193",
    "+proj=cass +lat_0=31.7340969444444 +lon_0=35.2120805555556 " +
    "+x_0=170251.555 +y_0=1126867.909 +a=6378300.789 +b=6356566.435 " +
    "+towgs84=-275.7224,94.7824,340.8944,-8.001,-4.42,-11.821,1 " +
    "+units=m +no_defs +type=crs"
  );

  proj4.defs(
    "EPSG:3857",
    "+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 " +
    "+x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext " +
    "+no_defs +type=crs"
  );

  proj4.defs(
    "EPSG:27700",
    "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 " +
    "+x_0=400000 +y_0=-100000 +ellps=airy " +
    "+towgs84=446.448,-125.157,542.06,0.1502,0.247,0.8421,-20.4894 " +
    "+units=m +no_defs +type=crs"
  );

  proj4.defs(
    "EPSG:2154",
    "+proj=lcc +lat_0=46.5 +lon_0=3 +lat_1=49 +lat_2=44 " +
    "+x_0=700000 +y_0=6600000 +ellps=GRS80 " +
    "+units=m +no_defs +type=crs"
  );

  const ISRAEL_AREA = { west: 34.17, south: 29.45, east: 35.69, north: 33.28 };

  const CRS_CATALOG = [
    {
      key: "EPSG:4326",
      code: "EPSG:4326",
      epsg: "4326",
      name: "WGS 84",
      aliases: ["geographic", "longitude latitude", "lon lat", "gps"],
      type: "geographic",
      area: { west: -180, south: -90, east: 180, north: 90 },
      xMin: -180, xMax: 180, yMin: -90, yMax: 90,
      xName: "Longitude", yName: "Latitude",
      help: "Expected: longitude −180° to 180°; latitude −90° to 90°."
    },
    {
      key: "EPSG:3857",
      code: "EPSG:3857",
      epsg: "3857",
      name: "WGS 84 / Pseudo-Mercator",
      aliases: ["web mercator", "google mercator", "osm", "slippy map"],
      type: "projected",
      area: { west: -180, south: -85.06, east: 180, north: 85.06 },
      xMin: -20037508.35, xMax: 20037508.35,
      yMin: -20048966.11, yMax: 20048966.11,
      xName: "Easting", yName: "Northing",
      help: "Expected Web Mercator metres; latitude coverage is approximately 85.06°S–85.06°N."
    },
    {
      key: "EPSG:2039",
      code: "EPSG:2039",
      epsg: "2039",
      name: "Israeli TM Grid (ITM)",
      aliases: ["israel new grid", "itm", "israel tm"],
      type: "projected",
      area: ISRAEL_AREA,
      xMin: 119097.33, xMax: 266563.36,
      yMin: 373609.64, yMax: 798747.07,
      xName: "Easting", yName: "Northing",
      help: "Expected: Easting 119,097–266,563 m; Northing 373,610–798,747 m."
    },
    {
      key: "EPSG:28193",
      code: "EPSG:28193",
      epsg: "28193",
      name: "Israeli Old Grid (ICS)",
      aliases: ["israel old grid", "ics", "israeli cs grid", "palestine 1923"],
      type: "projected",
      area: ISRAEL_AREA,
      xMin: 69099.91, xMax: 216561.80,
      yMin: 873606.74, yMax: 1298746.25,
      xName: "Easting", yName: "Northing",
      help: "Expected: Easting 69,100–216,562 m; Northing 873,607–1,298,746 m."
    },
    {
      key: "EPSG:27700",
      code: "EPSG:27700",
      epsg: "27700",
      name: "OSGB36 / British National Grid",
      aliases: ["british national grid", "bng", "osgb", "great britain", "uk grid"],
      type: "projected",
      area: { west: -9.01, south: 49.75, east: 2.01, north: 61.01 },
      xMin: -110000, xMax: 710000,
      yMin: -20000, yMax: 1270000,
      xName: "Easting", yName: "Northing",
      help: "Expected British National Grid metres within Great Britain and its EPSG area of use."
    },
    {
      key: "EPSG:2154",
      code: "EPSG:2154",
      epsg: "2154",
      name: "RGF93 v1 / Lambert-93",
      aliases: ["lambert 93", "lambert-93", "france", "rgf93"],
      type: "projected",
      area: { west: -9.86, south: 41.15, east: 10.38, north: 51.56 },
      xMin: 40047.98, xMax: 1256237.17,
      yMin: 6023107.63, yMax: 7143566.38,
      xName: "Easting", yName: "Northing",
      help: "Expected Lambert-93 metres within metropolitan France and Corsica."
    },
    {
      key: "UTM",
      code: "UTM",
      epsg: "",
      name: "WGS 84 / UTM",
      aliases: ["universal transverse mercator", "utm north", "utm south"],
      type: "utm",
      help: "Select a UTM zone from 1 to 60 and the northern or southern hemisphere."
    }
  ];

  const CRS_RULES = Object.fromEntries(
    CRS_CATALOG
      .filter((item) => item.key !== "UTM")
      .map((item) => [item.key, item])
  );

  function catalogLabel(item) {
    return item.key === "UTM"
      ? "UTM — choose zone and hemisphere"
      : `${item.name} — ${item.code}`;
  }

  function searchCatalog(query) {
    const normalized = String(query || "").trim().toLowerCase();
    if (!normalized) return CRS_CATALOG;

    const tokens = normalized.split(/\s+/).filter(Boolean);

    return CRS_CATALOG
      .map((item) => {
        const text = [
          item.key, item.code, item.epsg, item.name,
          ...(item.aliases || [])
        ].join(" ").toLowerCase();

        const matched = tokens.every((token) => text.includes(token));
        let score = 0;

        if (item.epsg === normalized || item.key.toLowerCase() === normalized) score += 100;
        if (item.name.toLowerCase().startsWith(normalized)) score += 40;
        if (text.includes(normalized)) score += 20;

        return { item, matched, score };
      })
      .filter((entry) => entry.matched)
      .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
      .map((entry) => entry.item);
  }

  function mountCrsControls(containerId, prefix) {
    const container = $(containerId);
    const fragment = $("crs-controls-template").content.cloneNode(true);
    container.appendChild(fragment);

    const q = (role) => container.querySelector(`[data-role="${role}"]`);
    const controls = {
      prefix,
      sourceSearch: q("source-search"),
      targetSearch: q("target-search"),
      sourceSearchResults: q("source-search-results"),
      targetSearchResults: q("target-search-results"),
      sourceCrs: q("source-crs"),
      targetCrs: q("target-crs"),
      sourceUtmOptions: q("source-utm-options"),
      targetUtmOptions: q("target-utm-options"),
      sourceZone: q("source-zone"),
      targetZone: q("target-zone"),
      sourceHemisphere: q("source-hemisphere"),
      targetHemisphere: q("target-hemisphere"),
      autoTargetUtm: q("auto-target-utm"),
      sourceZoneHelp: q("source-zone-help"),
      targetZoneHelp: q("target-zone-help"),
      sourceRangeHelp: q("source-range-help"),
      swap: q("swap")
    };

    populateCrsSelect(controls.sourceCrs, "EPSG:4326");
    populateCrsSelect(controls.targetCrs, "EPSG:2039");
    fillZones(controls.sourceZone, 36);
    fillZones(controls.targetZone, 36);
    initialiseCrsSearch(controls, "source");
    initialiseCrsSearch(controls, "target");

    [
      controls.sourceCrs, controls.targetCrs,
      controls.sourceZone, controls.targetZone,
      controls.sourceHemisphere, controls.targetHemisphere,
      controls.autoTargetUtm
    ].forEach((element) => {
      element.addEventListener("change", () => {
        updateCrsControls(controls);
        if (prefix === "single") updateSingleInputLabels();
      });
    });

    controls.swap.addEventListener("click", () => {
      const oldCrs = controls.sourceCrs.value;
      controls.sourceCrs.value = controls.targetCrs.value;
      controls.targetCrs.value = oldCrs;

      const oldZone = controls.sourceZone.value;
      controls.sourceZone.value = controls.targetZone.value;
      controls.targetZone.value = oldZone;

      const oldHemisphere = controls.sourceHemisphere.value;
      controls.sourceHemisphere.value = controls.targetHemisphere.value;
      controls.targetHemisphere.value = oldHemisphere;

      controls.sourceCrs.dispatchEvent(new Event("change", { bubbles: true }));
      controls.targetCrs.dispatchEvent(new Event("change", { bubbles: true }));
      updateCrsControls(controls);
      if (prefix === "single") updateSingleInputLabels();
    });

    updateCrsControls(controls);
    return controls;
  }

  function populateCrsSelect(select, selectedKey) {
    select.innerHTML = "";
    CRS_CATALOG.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.key;
      option.textContent = catalogLabel(item);
      option.selected = item.key === selectedKey;
      select.appendChild(option);
    });
  }

  function initialiseCrsSearch(controls, side) {
    const input = side === "source" ? controls.sourceSearch : controls.targetSearch;
    const results = side === "source"
      ? controls.sourceSearchResults
      : controls.targetSearchResults;
    const select = side === "source" ? controls.sourceCrs : controls.targetCrs;

    function closeResults() {
      results.classList.add("is-hidden");
      results.replaceChildren();
    }

    function choose(item) {
      select.value = item.key;
      input.value = item.key === "UTM" ? "UTM" : `${item.code} — ${item.name}`;
      closeResults();
      updateCrsControls(controls);
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function render() {
      const matches = searchCatalog(input.value).slice(0, 12);
      results.replaceChildren();

      if (!input.value.trim()) {
        closeResults();
        return;
      }

      if (!matches.length) {
        const empty = document.createElement("div");
        empty.className = "crs-result-button";
        empty.textContent = "No supported CRS matches this search.";
        results.appendChild(empty);
        results.classList.remove("is-hidden");
        return;
      }

      matches.forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "crs-result-button";
        button.setAttribute("role", "option");

        const code = document.createElement("span");
        code.className = "crs-result-code";
        code.textContent = item.key === "UTM" ? "UTM" : item.code;

        const name = document.createTextNode(item.name);

        const meta = document.createElement("span");
        meta.className = "crs-result-meta";
        meta.textContent = item.key === "UTM"
          ? "Zones 1–60; northern or southern hemisphere"
          : item.aliases.slice(0, 3).join(" · ");

        button.append(code, name, meta);
        button.addEventListener("click", () => choose(item));
        results.appendChild(button);
      });

      results.classList.remove("is-hidden");
    }

    input.addEventListener("input", render);
    input.addEventListener("focus", render);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeResults();
      if (event.key === "Enter") {
        const match = searchCatalog(input.value)[0];
        if (match) {
          event.preventDefault();
          choose(match);
        }
      }
    });

    select.addEventListener("change", () => {
      const item = CRS_CATALOG.find((entry) => entry.key === select.value);
      input.value = item && item.key !== "UTM"
        ? `${item.code} — ${item.name}`
        : item ? "UTM" : "";
    });

    document.addEventListener("click", (event) => {
      if (!results.contains(event.target) && event.target !== input) closeResults();
    });

    const initial = CRS_CATALOG.find((item) => item.key === select.value);
    input.value = initial && initial.key !== "UTM"
      ? `${initial.code} — ${initial.name}`
      : initial ? "UTM" : "";
  }

  function fillZones(select, selectedZone) {
    select.innerHTML = "";
    for (let zone = 1; zone <= 60; zone += 1) {
      const option = document.createElement("option");
      option.value = String(zone);
      option.textContent = String(zone);
      option.selected = zone === selectedZone;
      select.appendChild(option);
    }
  }

  function updateCrsControls(controls) {
    const sourceIsUtm = controls.sourceCrs.value === "UTM";
    const targetIsUtm = controls.targetCrs.value === "UTM";
    controls.sourceUtmOptions.classList.toggle("is-hidden", !sourceIsUtm);
    controls.targetUtmOptions.classList.toggle("is-hidden", !targetIsUtm);
    updateZoneHelp(controls.sourceZoneHelp, Number(controls.sourceZone.value));
    updateZoneHelp(controls.targetZoneHelp, Number(controls.targetZone.value));

    controls.sourceRangeHelp.textContent = sourceIsUtm
      ? "Expected: Easting approximately 100,000–900,000 m; Northing 0–10,000,000 m."
      : CRS_RULES[controls.sourceCrs.value].help;
  }

  function updateZoneHelp(element, zone) {
    const west = -180 + (zone - 1) * 6;
    element.textContent = `Standard zone ${zone}: ${west}° to ${west + 6}° longitude.`;
  }

  function parseCoordinate(rawValue) {
    if (typeof rawValue === "number") {
      if (!Number.isFinite(rawValue)) throw new Error("Coordinate is not a finite number.");
      return rawValue;
    }
    if (rawValue === null || rawValue === undefined || String(rawValue).trim() === "") {
      throw new Error("A coordinate value is missing.");
    }
    const cleaned = String(rawValue).trim().replace(/\s+/g, "").replace(",", ".");
    const value = Number(cleaned);
    if (!Number.isFinite(value)) throw new Error(`"${rawValue}" is not a valid number.`);
    return value;
  }

  function within(value, min, max, tolerance = 0) {
    return value >= min - tolerance && value <= max + tolerance;
  }

  function normaliseLongitude(longitude) {
    if (longitude === 180) return 180;
    return ((longitude + 180) % 360 + 360) % 360 - 180;
  }

  function standardUtmZone(longitude) {
    const lon = normaliseLongitude(longitude);
    if (lon === 180) return 60;
    return Math.floor((lon + 180) / 6) + 1;
  }

  function utmZoneForLocation(longitude, latitude) {
    const lon = normaliseLongitude(longitude);
    if (latitude >= 56 && latitude < 64 && lon >= 3 && lon < 12) return 32;
    if (latitude >= 72 && latitude < 84) {
      if (lon >= 0 && lon < 9) return 31;
      if (lon >= 9 && lon < 21) return 33;
      if (lon >= 21 && lon < 33) return 35;
      if (lon >= 33 && lon < 42) return 37;
    }
    return standardUtmZone(lon);
  }

  function hemisphereForLatitude(latitude) {
    return latitude >= 0 ? "N" : "S";
  }

  function createUtmDefinition(zone, hemisphere) {
    const code = `CUSTOM:UTM${zone}${hemisphere}`;
    const southFlag = hemisphere === "S" ? " +south" : "";
    proj4.defs(
      code,
      `+proj=utm +zone=${zone}${southFlag} +datum=WGS84 +units=m +no_defs +type=crs`
    );
    return code;
  }

  function resolveCrs(controls, side, geographicLocation = null) {
    const sourceSide = side === "source";
    const selected = sourceSide ? controls.sourceCrs.value : controls.targetCrs.value;

    if (selected !== "UTM") {
      return {
        key: selected,
        code: selected,
        type: CRS_RULES[selected].type,
        label: catalogLabel(CRS_RULES[selected])
      };
    }

    let zone = Number(sourceSide ? controls.sourceZone.value : controls.targetZone.value);
    let hemisphere = sourceSide
      ? controls.sourceHemisphere.value
      : controls.targetHemisphere.value;

    if (
      !sourceSide &&
      controls.autoTargetUtm.checked &&
      geographicLocation
    ) {
      zone = utmZoneForLocation(geographicLocation[0], geographicLocation[1]);
      hemisphere = hemisphereForLatitude(geographicLocation[1]);
    }

    if (!Number.isInteger(zone) || zone < 1 || zone > 60) {
      throw new Error("UTM zone must be a whole number from 1 to 60.");
    }

    return {
      key: "UTM",
      code: createUtmDefinition(zone, hemisphere),
      type: "projected",
      zone,
      hemisphere,
      label: `WGS 84 / UTM zone ${zone}${hemisphere}`
    };
  }

  function isWithinArea(longitude, latitude, area, tolerance = 0.02) {
    return (
      within(longitude, area.west, area.east, tolerance) &&
      within(latitude, area.south, area.north, tolerance)
    );
  }

  function validateGeographic(longitude, latitude) {
    if (!within(longitude, -180, 180)) throw new Error("Longitude must be between −180° and 180°.");
    if (!within(latitude, -90, 90)) throw new Error("Latitude must be between −90° and 90°.");
  }

  function validateProjectedInput(x, y, crsKey) {
    const rule = CRS_RULES[crsKey];
    if (within(x, rule.xMin, rule.xMax) && within(y, rule.yMin, rule.yMax)) return;

    if (within(y, rule.xMin, rule.xMax) && within(x, rule.yMin, rule.yMax)) {
      throw new Error(`${rule.label}: values appear reversed; enter Easting first and Northing second.`);
    }

    throw new Error(
      `${rule.label}: coordinate outside expected bounds ` +
      `(Easting ${Math.round(rule.xMin).toLocaleString()}–${Math.round(rule.xMax).toLocaleString()}, ` +
      `Northing ${Math.round(rule.yMin).toLocaleString()}–${Math.round(rule.yMax).toLocaleString()}).`
    );
  }

  function validateUtmNumeric(easting, northing) {
    if (within(easting, 100000, 900000) && within(northing, 0, 10000000)) return;
    if (within(northing, 100000, 900000) && within(easting, 0, 10000000)) {
      throw new Error("UTM values may be reversed; enter Easting first and Northing second.");
    }
    throw new Error("Implausible UTM coordinate; expected Easting 100,000–900,000 m and Northing 0–10,000,000 m.");
  }

  function validateSourceInput(source, x, y) {
    if (source.key === "EPSG:4326") validateGeographic(x, y);
    else if (source.key === "UTM") validateUtmNumeric(x, y);
    else validateProjectedInput(x, y, source.key);
  }

  function toGeographic(source, x, y) {
    if (source.key === "EPSG:4326") return [x, y];
    const result = proj4(source.code, "EPSG:4326", [x, y]);
    if (!result || !Number.isFinite(result[0]) || !Number.isFinite(result[1])) {
      throw new Error("Input could not be resolved to a valid geographic location.");
    }
    validateGeographic(result[0], result[1]);
    return result;
  }

  function validateSourceArea(source, longitude, latitude) {
    if (source.key !== "UTM" && source.key !== "EPSG:4326") {
      const rule = CRS_RULES[source.key];
      if (rule.area && !isWithinArea(longitude, latitude, rule.area)) {
        throw new Error(`${rule.name}: coordinate resolves outside its EPSG area of use.`);
      }
    }

    if (source.key === "UTM") {
      if (latitude < -80 || latitude > 84) throw new Error("UTM is normally used only between 80°S and 84°N.");
      const expectedZone = utmZoneForLocation(longitude, latitude);
      const expectedHemisphere = hemisphereForLatitude(latitude);
      if (source.zone !== expectedZone || source.hemisphere !== expectedHemisphere) {
        throw new Error(
          `Source UTM coordinate resolves to zone ${expectedZone}${expectedHemisphere}, ` +
          `not declared zone ${source.zone}${source.hemisphere}.`
        );
      }
    }
  }

  function validateTargetArea(target, longitude, latitude) {
    if (target.key !== "UTM" && target.key !== "EPSG:4326") {
      const rule = CRS_RULES[target.key];
      if (rule.area && !isWithinArea(longitude, latitude, rule.area)) {
        throw new Error(`${rule.name}: location is outside its EPSG area of use.`);
      }
    }
    if (target.key === "UTM" && (latitude < -80 || latitude > 84)) {
      throw new Error("UTM is normally used only between 80°S and 84°N.");
    }
  }

  function validateManualTargetUtm(controls, target, longitude, latitude) {
    if (target.key !== "UTM" || controls.autoTargetUtm.checked) return;
    const expectedZone = utmZoneForLocation(longitude, latitude);
    const expectedHemisphere = hemisphereForLatitude(latitude);
    if (target.zone !== expectedZone || target.hemisphere !== expectedHemisphere) {
      throw new Error(
        `Location belongs to UTM zone ${expectedZone}${expectedHemisphere}, ` +
        `not ${target.zone}${target.hemisphere}.`
      );
    }
  }

  function validateRoundTrip(source, target, input, output) {
    const returned = proj4(target.code, source.code, output);
    const tolerance = source.type === "geographic" ? 1e-7 : 0.05;
    if (
      !returned ||
      !Number.isFinite(returned[0]) ||
      !Number.isFinite(returned[1]) ||
      Math.abs(returned[0] - input[0]) > tolerance ||
      Math.abs(returned[1] - input[1]) > tolerance
    ) {
      throw new Error("Transformation failed its round-trip consistency check.");
    }
  }

  function convertCoordinate(controls, rawX, rawY) {
    const x = parseCoordinate(rawX);
    const y = parseCoordinate(rawY);
    const source = resolveCrs(controls, "source");
    validateSourceInput(source, x, y);

    const geographic = toGeographic(source, x, y);
    validateSourceArea(source, geographic[0], geographic[1]);

    const target = resolveCrs(controls, "target", geographic);
    validateTargetArea(target, geographic[0], geographic[1]);
    validateManualTargetUtm(controls, target, geographic[0], geographic[1]);

    if (source.code === target.code) throw new Error("Source and target coordinate systems are identical.");

    const converted = proj4(source.code, target.code, [x, y]);
    if (!converted || !Number.isFinite(converted[0]) || !Number.isFinite(converted[1])) {
      throw new Error("Transformation did not return a valid coordinate.");
    }

    if (target.key === "UTM") {
      validateUtmNumeric(converted[0], converted[1]);
    } else if (target.key !== "EPSG:4326") {
      validateProjectedInput(converted[0], converted[1], target.key);
    }

    validateRoundTrip(source, target, [x, y], converted);

    return {
      x: converted[0],
      y: converted[1],
      sourceLabel: source.label,
      targetLabel: target.label,
      targetZone: target.key === "UTM" ? target.zone : "",
      targetHemisphere: target.key === "UTM" ? target.hemisphere : "",
      targetGeographic: target.key === "EPSG:4326",
      longitude: geographic[0],
      latitude: geographic[1]
    };
  }


  const osmAttribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  function addBaseLayer(map) {
    return L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: osmAttribution
    }).addTo(map);
  }

  const NOMINATIM_REVERSE_ENDPOINT =
    "https://nominatim.openstreetmap.org/reverse";
  const GEOCODE_CACHE_KEY = "coordinate-converter-v2.3-place-cache";
  const GEOCODE_MIN_INTERVAL_MS = 1100;
  let lastGeocodeRequestTime = 0;
  let geocodeQueue = Promise.resolve();
  let latestSingleGeographic = null;

  function loadGeocodeCache() {
    try {
      const parsed = JSON.parse(localStorage.getItem(GEOCODE_CACHE_KEY) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  const geocodeCache = loadGeocodeCache();

  function saveGeocodeCache() {
    try {
      const entries = Object.entries(geocodeCache).slice(-250);
      localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(Object.fromEntries(entries)));
    } catch (_) {
      // Cache failure must not prevent an explicit lookup.
    }
  }

  function geocodeCacheKey(longitude, latitude) {
    return `${latitude.toFixed(5)},${longitude.toFixed(5)}`;
  }

  function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  function queueReverseGeocode(longitude, latitude) {
    const task = async () => {
      const key = geocodeCacheKey(longitude, latitude);
      if (geocodeCache[key]) return geocodeCache[key];

      const elapsed = Date.now() - lastGeocodeRequestTime;
      if (elapsed < GEOCODE_MIN_INTERVAL_MS) {
        await wait(GEOCODE_MIN_INTERVAL_MS - elapsed);
      }

      const url = new URL(NOMINATIM_REVERSE_ENDPOINT);
      url.searchParams.set("format", "geocodejson");
      url.searchParams.set("lat", String(latitude));
      url.searchParams.set("lon", String(longitude));
      url.searchParams.set("zoom", "18");
      url.searchParams.set("addressdetails", "1");
      url.searchParams.set("accept-language", navigator.language || "en");

      lastGeocodeRequestTime = Date.now();

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { "Accept": "application/geocode+json, application/json" },
        referrerPolicy: "strict-origin-when-cross-origin"
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("The place-name service is temporarily rate-limited. Please wait and try again.");
        }
        throw new Error(`Place lookup failed with HTTP ${response.status}.`);
      }

      const data = await response.json();
      const feature = data && data.features && data.features[0];

      if (!feature) {
        throw new Error("No mapped place or address was found near this coordinate.");
      }

      const geocoding = feature.properties && feature.properties.geocoding
        ? feature.properties.geocoding
        : {};

      const result = {
        label:
          geocoding.label ||
          geocoding.name ||
          "Nearest mapped location",
        name: geocoding.name || "",
        street: geocoding.street || "",
        housenumber: geocoding.housenumber || "",
        district:
          geocoding.district ||
          geocoding.locality ||
          geocoding.suburb ||
          "",
        city:
          geocoding.city ||
          geocoding.town ||
          geocoding.village ||
          geocoding.municipality ||
          "",
        county: geocoding.county || "",
        state: geocoding.state || "",
        postcode: geocoding.postcode || "",
        country: geocoding.country || "",
        countryCode: (geocoding.country_code || "").toUpperCase()
      };

      geocodeCache[key] = result;
      saveGeocodeCache();
      return result;
    };

    geocodeQueue = geocodeQueue.then(task, task);
    return geocodeQueue;
  }

  function renderPlaceResult(containerId, nameId, detailsId, place) {
    const container = $(containerId);
    const name = $(nameId);
    const details = $(detailsId);

    name.textContent = place.label;
    details.replaceChildren();

    const fields = [
      ["Name", place.name],
      ["Street", [place.street, place.housenumber].filter(Boolean).join(" ")],
      ["District", place.district],
      ["City / locality", place.city],
      ["County", place.county],
      ["State / region", place.state],
      ["Postcode", place.postcode],
      ["Country", [place.country, place.countryCode].filter(Boolean).join(" — ")]
    ];

    fields.forEach(([label, value]) => {
      if (!value) return;
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      row.append(dt, dd);
      details.appendChild(row);
    });

    container.classList.remove("is-hidden");
  }

  async function lookupAndDisplayPlace(longitude, latitude, target) {
    const button = target === "single"
      ? $("lookup-result-place")
      : $("lookup-map-place");
    const messageElement = target === "single"
      ? $("single-message")
      : $("map-coordinate-readout");

    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = "Looking up place…";

    try {
      const place = await queueReverseGeocode(longitude, latitude);

      if (target === "single") {
        renderPlaceResult(
          "single-place-result",
          "single-place-name",
          "single-place-details",
          place
        );
        showMessage(
          $("single-message"),
          "The nearest mapped place was found.",
          "success"
        );
      } else {
        renderPlaceResult(
          "map-place-result",
          "map-place-name",
          "map-place-details",
          place
        );
        $("map-coordinate-readout").textContent =
          `Selected WGS 84: ${longitude.toFixed(7)}, ${latitude.toFixed(7)} — ${place.label}`;

        if (singleMapMarker) {
          singleMapMarker
            .bindPopup(
              coordinatePopup(longitude, latitude, "Selected location") +
              `<div class="coordinate-popup">${escapeHtml(place.label)}</div>`
            )
            .openPopup();
        }
      }
    } catch (error) {
      if (target === "single") {
        showMessage(
          $("single-message"),
          error.message || "Place lookup failed.",
          "error"
        );
      } else {
        $("map-coordinate-readout").textContent =
          error.message || "Place lookup failed.";
      }
    } finally {
      button.textContent = originalText;
      button.disabled = target === "single"
        ? !latestSingleGeographic
        : !selectedMapPoint;
    }
  }

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = String(value || "");
    return div.innerHTML;
  }

  const singleMap = L.map("single-map", {
    center: [31.8, 35.0],
    zoom: 7,
    zoomControl: true
  });
  addBaseLayer(singleMap);

  let singleMapMarker = null;
  let selectedMapPoint = null;

  function coordinatePopup(longitude, latitude, title) {
    return (
      '<div class="coordinate-popup"><strong>' + title + '</strong><br>' +
      'Longitude: ' + longitude.toFixed(7) + '<br>' +
      'Latitude: ' + latitude.toFixed(7) + '</div>'
    );
  }

  function setSingleMapPoint(longitude, latitude, options = {}) {
    if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return;

    selectedMapPoint = { longitude, latitude };

    if (!singleMapMarker) {
      singleMapMarker = L.marker([latitude, longitude]).addTo(singleMap);
    } else {
      singleMapMarker.setLatLng([latitude, longitude]);
    }

    singleMapMarker
      .bindPopup(coordinatePopup(longitude, latitude, options.title || "Selected location"))
      .openPopup();

    if (options.zoom !== false) {
      singleMap.setView([latitude, longitude], Math.max(singleMap.getZoom(), 12));
    }

    $("map-coordinate-readout").textContent =
      `Selected WGS 84: ${longitude.toFixed(7)}, ${latitude.toFixed(7)}`;
    $("use-map-point").disabled = false;
    $("lookup-map-place").disabled = false;
    $("clear-map-point").disabled = false;
    $("map-place-result").classList.add("is-hidden");
  }

  function clearSingleMapPoint() {
    if (singleMapMarker) {
      singleMap.removeLayer(singleMapMarker);
      singleMapMarker = null;
    }
    selectedMapPoint = null;
    $("map-coordinate-readout").textContent =
      "Click anywhere on the map to select a location.";
    $("use-map-point").disabled = true;
    $("lookup-map-place").disabled = true;
    $("clear-map-point").disabled = true;
    $("map-place-result").classList.add("is-hidden");
  }

  singleMap.on("click", (event) => {
    setSingleMapPoint(event.latlng.lng, event.latlng.lat, {
      title: "Map-selected location",
      zoom: false
    });
  });

  let cursorFramePending = false;
  let lastCursorLatLng = null;

  function updateCursorCoordinates(longitude, latitude) {
    $("cursor-wgs84").textContent =
      `${longitude.toFixed(7)}, ${latitude.toFixed(7)}`;

    if (latitude >= -80 && latitude <= 84) {
      const zone = utmZoneForLocation(longitude, latitude);
      const hemisphere = hemisphereForLatitude(latitude);
      const utmCode = createUtmDefinition(zone, hemisphere);
      const utm = proj4("EPSG:4326", utmCode, [longitude, latitude]);
      $("cursor-utm").textContent =
        `${zone}${hemisphere}: ${utm[0].toFixed(2)}, ${utm[1].toFixed(2)}`;
    } else {
      $("cursor-utm").textContent = "Outside normal UTM latitude coverage";
    }

    if (isWithinArea(longitude, latitude, ISRAEL_AREA)) {
      const itm = proj4("EPSG:4326", "EPSG:2039", [longitude, latitude]);
      $("cursor-itm").textContent =
        `${itm[0].toFixed(2)}, ${itm[1].toFixed(2)}`;
    } else {
      $("cursor-itm").textContent = "Outside EPSG:2039 area of use";
    }
  }

  singleMap.on("mousemove", (event) => {
    lastCursorLatLng = event.latlng;
    if (cursorFramePending) return;

    cursorFramePending = true;
    requestAnimationFrame(() => {
      cursorFramePending = false;
      if (!lastCursorLatLng) return;
      updateCursorCoordinates(
        lastCursorLatLng.lng,
        lastCursorLatLng.lat
      );
    });
  });

  singleMap.on("mouseout", () => {
    $("cursor-wgs84").textContent = "Move the pointer over the map";
    $("cursor-utm").textContent = "—";
    $("cursor-itm").textContent = "Outside area of use";
  });

  $("use-map-point").addEventListener("click", () => {
    if (!selectedMapPoint) return;

    singleControls.sourceCrs.value = "EPSG:4326";
    singleControls.sourceCrs.dispatchEvent(new Event("change", { bubbles: true }));
    updateCrsControls(singleControls);
    updateSingleInputLabels();

    $("single-x").value = selectedMapPoint.longitude.toFixed(7);
    $("single-y").value = selectedMapPoint.latitude.toFixed(7);
    showMessage(
      $("single-message"),
      "The map location was copied to the WGS 84 input fields.",
      "success"
    );
  });

  $("clear-map-point").addEventListener("click", clearSingleMapPoint);

  $("lookup-map-place").addEventListener("click", () => {
    if (!selectedMapPoint) return;
    lookupAndDisplayPlace(
      selectedMapPoint.longitude,
      selectedMapPoint.latitude,
      "map"
    );
  });

  let batchMap = null;
  let batchPointLayer = null;

  function ensureBatchMap() {
    if (!batchMap) {
      batchMap = L.map("batch-map", {
        center: [31.8, 35.0],
        zoom: 7,
        preferCanvas: true
      });
      addBaseLayer(batchMap);
      batchPointLayer = L.layerGroup().addTo(batchMap);
    }
    setTimeout(() => batchMap.invalidateSize(), 0);
    return batchMap;
  }

  function renderBatchMap(points, totalSuccessful) {
    const section = $("batch-map-section");

    if (!points.length) {
      section.classList.add("is-hidden");
      return;
    }

    section.classList.remove("is-hidden");
    const map = ensureBatchMap();
    batchPointLayer.clearLayers();

    const bounds = [];
    points.forEach((point) => {
      const latlng = [point.latitude, point.longitude];
      bounds.push(latlng);
      L.circleMarker(latlng, {
        radius: 4,
        weight: 1,
        fillOpacity: 0.7
      })
        .bindPopup(coordinatePopup(point.longitude, point.latitude, `Row ${point.row}`))
        .addTo(batchPointLayer);
    });

    if (bounds.length === 1) {
      map.setView(bounds[0], 12);
    } else {
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 13 });
    }

    const shown = points.length;
    $("batch-map-note").textContent =
      shown < totalSuccessful
        ? `Showing a representative sample of ${shown.toLocaleString()} of ${totalSuccessful.toLocaleString()} converted points.`
        : `Showing all ${shown.toLocaleString()} converted points.`;

    setTimeout(() => map.invalidateSize(), 30);
  }

  const singleControls = mountCrsControls("single-crs-controls", "single");
  const batchControls = mountCrsControls("batch-crs-controls", "batch");

  function updateSingleInputLabels() {
    const geographic = singleControls.sourceCrs.value === "EPSG:4326";
    $("single-x-label").textContent = geographic ? "Longitude / X" : "Easting / X";
    $("single-y-label").textContent = geographic ? "Latitude / Y" : "Northing / Y";
    if (geographic) {
      $("single-x").placeholder = "35.2";
      $("single-y").placeholder = "32.5";
    } else if (singleControls.sourceCrs.value === "EPSG:3857") {
      $("single-x").placeholder = "3910000";
      $("single-y").placeholder = "3820000";
    } else if (singleControls.sourceCrs.value === "EPSG:27700") {
      $("single-x").placeholder = "530000";
      $("single-y").placeholder = "180000";
    } else if (singleControls.sourceCrs.value === "EPSG:2154") {
      $("single-x").placeholder = "700000";
      $("single-y").placeholder = "6600000";
    } else {
      $("single-x").placeholder = "200000";
      $("single-y").placeholder = "650000";
    }
    $("single-result").classList.add("is-hidden");
    $("single-place-result").classList.add("is-hidden");
    latestSingleGeographic = null;
    $("lookup-result-place").disabled = true;
    showMessage($("single-message"), "");
  }

  function showMessage(element, text, type = "") {
    element.textContent = text;
    element.className = `message${type ? ` ${type}` : ""}`;
  }

  $("single-convert").addEventListener("click", () => {
    $("single-result").classList.add("is-hidden");
    showMessage($("single-message"), "");
    try {
      const output = convertCoordinate(singleControls, $("single-x").value, $("single-y").value);
      $("single-result-crs").textContent = output.targetLabel;
      $("single-result-x-label").textContent = output.targetGeographic ? "Longitude" : "Easting";
      $("single-result-y-label").textContent = output.targetGeographic ? "Latitude" : "Northing";
      $("single-result-x").textContent = output.targetGeographic ? output.x.toFixed(7) : output.x.toFixed(3);
      $("single-result-y").textContent = output.targetGeographic ? output.y.toFixed(7) : output.y.toFixed(3);
      $("single-result").classList.remove("is-hidden");
      latestSingleGeographic = {
        longitude: output.longitude,
        latitude: output.latitude
      };
      $("lookup-result-place").disabled = false;
      $("single-place-result").classList.add("is-hidden");
      setSingleMapPoint(output.longitude, output.latitude, {
        title: "Converted location"
      });
      showMessage($("single-message"), "The coordinate was converted, validated, and displayed on the map.", "success");
    } catch (error) {
      showMessage($("single-message"), error.message || "Conversion failed.", "error");
    }
  });

  $("single-copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(
        `${$("single-result-x").textContent}, ${$("single-result-y").textContent}`
      );
      showMessage($("single-message"), "The converted coordinate was copied.", "success");
    } catch (_) {
      showMessage($("single-message"), "Copying failed. Copy the values manually.", "error");
    }
  });

  $("lookup-result-place").disabled = true;
  $("lookup-result-place").addEventListener("click", () => {
    if (!latestSingleGeographic) return;
    lookupAndDisplayPlace(
      latestSingleGeographic.longitude,
      latestSingleGeographic.latitude,
      "single"
    );
  });

  [$("single-x"), $("single-y")].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") $("single-convert").click();
    });
  });
  updateSingleInputLabels();
  function renderSupportedCatalog() {
    const container = $("supported-crs-list");
    const fragment = document.createDocumentFragment();

    CRS_CATALOG.forEach((item) => {
      const card = document.createElement("div");
      card.className = "supported-crs-item";

      const title = document.createElement("strong");
      title.textContent = item.key === "UTM" ? "UTM" : item.code;

      const name = document.createElement("span");
      name.textContent = item.key === "UTM"
        ? "WGS 84 / UTM zones 1–60, north and south"
        : item.name;

      card.append(title, name);
      fragment.appendChild(card);
    });

    container.replaceChildren(fragment);
  }

  renderSupportedCatalog();

  function activateTab(mode) {
    const single = mode === "single";
    $("single-tab").classList.toggle("is-active", single);
    $("batch-tab").classList.toggle("is-active", !single);
    $("single-tab").setAttribute("aria-selected", String(single));
    $("batch-tab").setAttribute("aria-selected", String(!single));
    $("single-panel").classList.toggle("is-hidden", !single);
    $("batch-panel").classList.toggle("is-hidden", single);
    setTimeout(() => {
      if (single) singleMap.invalidateSize();
      if (!single && batchMap) batchMap.invalidateSize();
    }, 30);
  }

  $("single-tab").addEventListener("click", () => activateTab("single"));
  $("batch-tab").addEventListener("click", () => activateTab("batch"));

  let workbook = null;
  let sheetMatrix = [];
  let outputMatrix = null;
  let errorMatrix = null;
  let inputFileBaseName = "coordinates";

  function resetBatchAfterFile() {
    $("batch-setup").classList.add("is-hidden");
    $("batch-crs-section").classList.add("is-hidden");
    $("batch-preview-section").classList.add("is-hidden");
    $("batch-results").classList.add("is-hidden");
    showMessage($("batch-message"), "");
    outputMatrix = null;
    errorMatrix = null;
    $("batch-map-section").classList.add("is-hidden");
    if (batchPointLayer) batchPointLayer.clearLayers();
  }

  $("batch-file").addEventListener("change", async (event) => {
    resetBatchAfterFile();
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showMessage($("batch-message"), "The file is larger than 15 MB.", "error");
      return;
    }

    inputFileBaseName = file.name.replace(/\.[^.]+$/, "") || "coordinates";

    try {
      const data = await file.arrayBuffer();
      workbook = XLSX.read(data, { type: "array", cellDates: true, dense: true });
      if (!workbook.SheetNames.length) throw new Error("The file contains no worksheets.");

      $("batch-sheet").innerHTML = "";
      workbook.SheetNames.forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        $("batch-sheet").appendChild(option);
      });

      $("batch-setup").classList.remove("is-hidden");
      $("batch-crs-section").classList.remove("is-hidden");
      $("batch-preview-section").classList.remove("is-hidden");
      loadSelectedSheet();
    } catch (error) {
      showMessage($("batch-message"), error.message || "The spreadsheet could not be read.", "error");
    }
  });

  function loadSelectedSheet() {
    if (!workbook) return;
    const sheet = workbook.Sheets[$("batch-sheet").value];
    sheetMatrix = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      raw: true,
      defval: null,
      blankrows: false
    });

    populateColumnSelectors();
    renderPreview();
  }

  function makeHeaderLabel(value, index) {
    const text = value === null || value === undefined || String(value).trim() === ""
      ? `Column ${index + 1}`
      : String(value).trim();
    return `${text} [${columnLetter(index)}]`;
  }

  function columnLetter(index) {
    let value = index + 1;
    let letters = "";
    while (value > 0) {
      const remainder = (value - 1) % 26;
      letters = String.fromCharCode(65 + remainder) + letters;
      value = Math.floor((value - 1) / 26);
    }
    return letters;
  }

  function populateColumnSelectors() {
    const headerIndex = Number($("batch-header-row").value);
    const header = sheetMatrix[headerIndex] || [];
    const maxColumns = Math.max(header.length, ...sheetMatrix.slice(0, 20).map((row) => row.length), 0);

    [$("batch-x-column"), $("batch-y-column")].forEach((select) => {
      select.innerHTML = "";
      for (let index = 0; index < maxColumns; index += 1) {
        const option = document.createElement("option");
        option.value = String(index);
        option.textContent = makeHeaderLabel(header[index], index);
        select.appendChild(option);
      }
    });

    const lowerHeaders = header.map((value) => String(value ?? "").trim().toLowerCase());
    const xIndex = lowerHeaders.findIndex((value) =>
      ["x", "longitude", "lon", "long", "easting", "east"].includes(value)
    );
    const yIndex = lowerHeaders.findIndex((value) =>
      ["y", "latitude", "lat", "northing", "north"].includes(value)
    );

    $("batch-x-column").value = String(xIndex >= 0 ? xIndex : 0);
    $("batch-y-column").value = String(yIndex >= 0 ? yIndex : Math.min(1, Math.max(0, maxColumns - 1)));
  }

  function renderPreview() {
    const headerIndex = Number($("batch-header-row").value);
    const header = sheetMatrix[headerIndex] || [];
    const rows = sheetMatrix.slice(headerIndex + 1).filter((row) =>
      row.some((value) => value !== null && value !== undefined && String(value).trim() !== "")
    );

    const maxColumns = Math.min(
      Math.max(header.length, ...rows.slice(0, PREVIEW_ROWS).map((row) => row.length), 0),
      12
    );

    const headRow = document.createElement("tr");
    for (let index = 0; index < maxColumns; index += 1) {
      const th = document.createElement("th");
      th.textContent = makeHeaderLabel(header[index], index);
      headRow.appendChild(th);
    }
    $("batch-preview-table").querySelector("thead").replaceChildren(headRow);

    const body = document.createDocumentFragment();
    rows.slice(0, PREVIEW_ROWS).forEach((row) => {
      const tr = document.createElement("tr");
      for (let index = 0; index < maxColumns; index += 1) {
        const td = document.createElement("td");
        const value = row[index];
        td.textContent = value instanceof Date
          ? value.toISOString().slice(0, 10)
          : value === null || value === undefined ? "" : String(value);
        tr.appendChild(td);
      }
      body.appendChild(tr);
    });
    $("batch-preview-table").querySelector("tbody").replaceChildren(body);

    $("batch-summary").textContent =
      `${rows.length.toLocaleString()} data rows; showing the first ${Math.min(rows.length, PREVIEW_ROWS)}.`;

    if (rows.length > MAX_ROWS) {
      showMessage(
        $("batch-message"),
        `This worksheet has ${rows.length.toLocaleString()} rows. The current limit is ${MAX_ROWS.toLocaleString()}.`,
        "error"
      );
      $("batch-convert").disabled = true;
    } else {
      showMessage($("batch-message"), "");
      $("batch-convert").disabled = rows.length === 0;
    }
    $("batch-results").classList.add("is-hidden");
  }

  $("batch-sheet").addEventListener("change", loadSelectedSheet);
  $("batch-header-row").addEventListener("change", () => {
    populateColumnSelectors();
    renderPreview();
  });
  $("batch-x-column").addEventListener("change", () => $("batch-results").classList.add("is-hidden"));
  $("batch-y-column").addEventListener("change", () => $("batch-results").classList.add("is-hidden"));

  function uniqueHeader(existing, desired) {
    let name = desired;
    let counter = 2;
    const normalized = new Set(existing.map((value) => String(value ?? "").toLowerCase()));
    while (normalized.has(name.toLowerCase())) {
      name = `${desired}_${counter}`;
      counter += 1;
    }
    existing.push(name);
    return name;
  }

  function nextFrame() {
    return new Promise((resolve) => requestAnimationFrame(resolve));
  }

  $("batch-convert").addEventListener("click", async () => {
    $("batch-results").classList.add("is-hidden");
    showMessage($("batch-message"), "");

    const headerIndex = Number($("batch-header-row").value);
    const header = [...(sheetMatrix[headerIndex] || [])];
    const dataRows = sheetMatrix.slice(headerIndex + 1).filter((row) =>
      row.some((value) => value !== null && value !== undefined && String(value).trim() !== "")
    );

    if (!dataRows.length) {
      showMessage($("batch-message"), "No data rows were found.", "error");
      return;
    }
    if (dataRows.length > MAX_ROWS) {
      showMessage($("batch-message"), `The maximum is ${MAX_ROWS.toLocaleString()} rows.`, "error");
      return;
    }

    const xIndex = Number($("batch-x-column").value);
    const yIndex = Number($("batch-y-column").value);
    if (xIndex === yIndex) {
      showMessage($("batch-message"), "Select two different columns for X and Y.", "error");
      return;
    }

    const outputHeaders = [...header];
    const added = {
      x: uniqueHeader(outputHeaders, "Converted_X"),
      y: uniqueHeader(outputHeaders, "Converted_Y"),
      source: uniqueHeader(outputHeaders, "Source_CRS"),
      target: uniqueHeader(outputHeaders, "Target_CRS"),
      zone: uniqueHeader(outputHeaders, "Target_UTM_Zone"),
      hemisphere: uniqueHeader(outputHeaders, "Target_UTM_Hemisphere"),
      status: uniqueHeader(outputHeaders, "Conversion_Status"),
      message: uniqueHeader(outputHeaders, "Conversion_Message")
    };

    const outputRows = [outputHeaders];
    const errors = [[
      "Excel_Row", "Original_X", "Original_Y",
      "Source_CRS", "Target_CRS", "Error_Message"
    ]];

    let successCount = 0;
    let errorCount = 0;
    const batchMapPoints = [];
    const MAX_MAP_POINTS = 1000;

    $("batch-progress-wrap").classList.remove("is-hidden");
    $("batch-progress").value = 0;
    $("batch-convert").disabled = true;

    for (let index = 0; index < dataRows.length; index += 1) {
      const original = [...dataRows[index]];
      while (original.length < header.length) original.push(null);

      const resultCells = new Array(8).fill("");
      try {
        const conversion = convertCoordinate(batchControls, original[xIndex], original[yIndex]);
        resultCells[0] = conversion.targetGeographic ? conversion.x : Number(conversion.x.toFixed(3));
        resultCells[1] = conversion.targetGeographic ? conversion.y : Number(conversion.y.toFixed(3));
        resultCells[2] = conversion.sourceLabel;
        resultCells[3] = conversion.targetLabel;
        resultCells[4] = conversion.targetZone;
        resultCells[5] = conversion.targetHemisphere;
        resultCells[6] = "OK";
        resultCells[7] = "";
        successCount += 1;

        // Keep at most 1,000 points for an efficient browser map preview.
        if (batchMapPoints.length < MAX_MAP_POINTS) {
          batchMapPoints.push({
            longitude: conversion.longitude,
            latitude: conversion.latitude,
            row: headerIndex + index + 2
          });
        }
      } catch (error) {
        let sourceLabel = batchControls.sourceCrs.options[batchControls.sourceCrs.selectedIndex].text;
        let targetLabel = batchControls.targetCrs.options[batchControls.targetCrs.selectedIndex].text;
        resultCells[2] = sourceLabel;
        resultCells[3] = targetLabel;
        resultCells[6] = "ERROR";
        resultCells[7] = error.message || "Conversion failed.";
        errors.push([
          headerIndex + index + 2,
          original[xIndex],
          original[yIndex],
          sourceLabel,
          targetLabel,
          resultCells[7]
        ]);
        errorCount += 1;
      }

      outputRows.push(original.concat(resultCells));

      if (index % 200 === 0 || index === dataRows.length - 1) {
        const percent = Math.round(((index + 1) / dataRows.length) * 100);
        $("batch-progress").value = percent;
        $("batch-progress-text").textContent =
          `${percent}% — ${(index + 1).toLocaleString()} of ${dataRows.length.toLocaleString()}`;
        await nextFrame();
      }
    }

    outputMatrix = outputRows;
    errorMatrix = errors.length > 1 ? errors : null;

    $("batch-total").textContent = dataRows.length.toLocaleString();
    $("batch-success").textContent = successCount.toLocaleString();
    $("batch-errors").textContent = errorCount.toLocaleString();
    $("download-errors").classList.toggle("is-hidden", !errorMatrix);
    $("batch-results").classList.remove("is-hidden");
    renderBatchMap(batchMapPoints, successCount);
    $("batch-convert").disabled = false;

    showMessage(
      $("batch-message"),
      `Completed: ${successCount.toLocaleString()} converted, ${errorCount.toLocaleString()} errors.`,
      errorCount ? "error" : "success"
    );
  });

  function createWorkbookFromMatrix(matrix, sheetName) {
    const worksheet = XLSX.utils.aoa_to_sheet(matrix);
    worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

    const widths = matrix[0].map((header, index) => {
      let width = Math.max(10, String(header ?? "").length + 2);
      for (const row of matrix.slice(1, 101)) {
        const value = row[index];
        if (value !== null && value !== undefined) {
          width = Math.max(width, Math.min(35, String(value).length + 2));
        }
      }
      return { wch: Math.min(width, 35) };
    });
    worksheet["!cols"] = widths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, sheetName);
    return wb;
  }

  $("download-results").addEventListener("click", () => {
    if (!outputMatrix) return;
    const wb = createWorkbookFromMatrix(outputMatrix, "Converted Coordinates");
    XLSX.writeFile(wb, `${inputFileBaseName}_converted.xlsx`, {
      compression: true,
      bookType: "xlsx"
    });
  });

  $("download-errors").addEventListener("click", () => {
    if (!errorMatrix) return;
    const wb = createWorkbookFromMatrix(errorMatrix, "Conversion Errors");
    XLSX.writeFile(wb, `${inputFileBaseName}_errors.xlsx`, {
      compression: true,
      bookType: "xlsx"
    });
  });

  $("download-template").addEventListener("click", () => {
    const template = [
      ["ID", "X", "Y", "Name"],
      [1, 35.2, 32.5, "Example WGS 84 point"],
      [2, 34.7818, 32.0853, "Example WGS 84 point"]
    ];
    const wb = createWorkbookFromMatrix(template, "Coordinates");
    XLSX.writeFile(wb, "coordinate_conversion_template.xlsx", {
      compression: true,
      bookType: "xlsx"
    });
  });
});
