document.addEventListener("DOMContentLoaded", function () {
  const $ = (id) => document.getElementById(id);

  const sourceCrs = $("source-crs");
  const targetCrs = $("target-crs");
  const sourceOptions = $("source-utm-options");
  const targetOptions = $("target-utm-options");
  const sourceZone = $("source-zone");
  const targetZone = $("target-zone");
  const sourceHemisphere = $("source-hemisphere");
  const targetHemisphere = $("target-hemisphere");
  const xInput = $("x");
  const yInput = $("y");
  const message = $("message");
  const result = $("result");

  if (typeof proj4 === "undefined") {
    message.textContent = "The transformation library could not be loaded.";
    message.className = "message error";
    return;
  }

  // Official EPSG.io Proj4js definitions.
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

  function fillZones(select, selected) {
    select.innerHTML = "";
    for (let zone = 1; zone <= 60; zone += 1) {
      const option = document.createElement("option");
      option.value = String(zone);
      option.textContent = String(zone);
      if (zone === selected) option.selected = true;
      select.appendChild(option);
    }
  }

  fillZones(sourceZone, 36);
  fillZones(targetZone, 36);

  function setMessage(text, type) {
    message.textContent = text;
    message.className = "message" + (type ? " " + type : "");
  }

  function clearResult() {
    result.classList.add("is-hidden");
    setMessage("", "");
  }

  function updateControls() {
    sourceOptions.classList.toggle("is-hidden", sourceCrs.value !== "UTM");
    targetOptions.classList.toggle("is-hidden", targetCrs.value !== "UTM");

    const geographic = sourceCrs.value === "EPSG:4326";
    $("x-label").textContent = geographic ? "Longitude / X" : "Easting / X";
    $("y-label").textContent = geographic ? "Latitude / Y" : "Northing / Y";
    xInput.placeholder = geographic ? "34.7818" : "180000";
    yInput.placeholder = geographic ? "32.0853" : "665000";

    clearResult();
  }

  function parseValue(value) {
    const number = Number(value.trim().replace(/\s+/g, "").replace(",", "."));
    if (!Number.isFinite(number)) {
      throw new Error("Enter valid numeric values for both coordinates.");
    }
    return number;
  }

  function resolveCrs(side) {
    const selected = side === "source" ? sourceCrs.value : targetCrs.value;

    if (selected !== "UTM") {
      return {
        code: selected,
        geographic: selected === "EPSG:4326",
        label:
          selected === "EPSG:4326" ? "WGS 84 — EPSG:4326" :
          selected === "EPSG:2039" ? "Israeli TM Grid — EPSG:2039" :
          "Israeli Old Grid — EPSG:28193"
      };
    }

    const zone = Number(side === "source" ? sourceZone.value : targetZone.value);
    const hemisphere = side === "source" ? sourceHemisphere.value : targetHemisphere.value;
    const code = "CUSTOM:UTM" + zone + hemisphere;

    const southParameter = hemisphere === "S" ? " +south" : "";
    proj4.defs(
      code,
      "+proj=utm +zone=" + zone + southParameter +
      " +datum=WGS84 +units=m +no_defs +type=crs"
    );

    return {
      code: code,
      geographic: false,
      label: "WGS 84 / UTM zone " + zone + hemisphere
    };
  }

  function convert() {
    clearResult();

    try {
      const source = resolveCrs("source");
      const target = resolveCrs("target");

      if (source.code === target.code) {
        throw new Error("The source and target coordinate systems are identical.");
      }

      const x = parseValue(xInput.value);
      const y = parseValue(yInput.value);

      if (source.geographic) {
        if (x < -180 || x > 180) throw new Error("Longitude must be between -180 and 180.");
        if (y < -90 || y > 90) throw new Error("Latitude must be between -90 and 90.");
      }

      const converted = proj4(source.code, target.code, [x, y]);

      if (!converted || !Number.isFinite(converted[0]) || !Number.isFinite(converted[1])) {
        throw new Error("The transformation did not return a valid coordinate.");
      }

      $("result-crs").textContent = target.label;
      $("result-x-label").textContent = target.geographic ? "Longitude" : "Easting";
      $("result-y-label").textContent = target.geographic ? "Latitude" : "Northing";
      $("result-x").textContent = target.geographic ? converted[0].toFixed(7) : converted[0].toFixed(3);
      $("result-y").textContent = target.geographic ? converted[1].toFixed(7) : converted[1].toFixed(3);

      result.classList.remove("is-hidden");
      setMessage("The coordinate was converted successfully.", "success");
    } catch (error) {
      setMessage(error && error.message ? error.message : "An unexpected error occurred.", "error");
    }
  }

  sourceCrs.addEventListener("change", updateControls);
  targetCrs.addEventListener("change", updateControls);
  sourceZone.addEventListener("change", clearResult);
  targetZone.addEventListener("change", clearResult);
  sourceHemisphere.addEventListener("change", clearResult);
  targetHemisphere.addEventListener("change", clearResult);

  $("convert").addEventListener("click", convert);

  $("swap").addEventListener("click", function () {
    const oldSource = sourceCrs.value;
    sourceCrs.value = targetCrs.value;
    targetCrs.value = oldSource;

    const oldZone = sourceZone.value;
    sourceZone.value = targetZone.value;
    targetZone.value = oldZone;

    const oldHemisphere = sourceHemisphere.value;
    sourceHemisphere.value = targetHemisphere.value;
    targetHemisphere.value = oldHemisphere;

    updateControls();
  });

  $("copy").addEventListener("click", async function () {
    const text = $("result-x").textContent + ", " + $("result-y").textContent;
    try {
      await navigator.clipboard.writeText(text);
      setMessage("The converted coordinate was copied.", "success");
    } catch (error) {
      setMessage("Copying failed. Select the values and copy them manually.", "error");
    }
  });

  [xInput, yInput].forEach(function (input) {
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") convert();
    });
  });

  updateControls();
});
