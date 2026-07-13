document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    sourceCrs: document.getElementById("source-crs"),
    targetCrs: document.getElementById("target-crs"),
    sourceUtmOptions: document.getElementById("source-utm-options"),
    targetUtmOptions: document.getElementById("target-utm-options"),
    sourceZone: document.getElementById("source-zone"),
    targetZone: document.getElementById("target-zone"),
    sourceHemisphere: document.getElementById("source-hemisphere"),
    targetHemisphere: document.getElementById("target-hemisphere"),
    x: document.getElementById("x"),
    y: document.getElementById("y"),
    xLabel: document.getElementById("x-label"),
    yLabel: document.getElementById("y-label"),
    message: document.getElementById("message"),
    result: document.getElementById("result"),
    resultCrs: document.getElementById("result-crs"),
    resultX: document.getElementById("result-x"),
    resultY: document.getElementById("result-y"),
    resultXLabel: document.getElementById("result-x-label"),
    resultYLabel: document.getElementById("result-y-label")
  };

  if (typeof proj4 === "undefined") {
    showMessage(
      "The coordinate transformation library did not load. Check your internet connection and reload the page.",
      "error"
    );
    return;
  }

  // Israel 1993 / Israeli TM Grid
  proj4.defs(
    "EPSG:2039",
    "+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 " +
    "+k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 " +
    "+towgs84=-48,55,52,0,0,0,0 +units=m +no_defs +type=crs"
  );

  // Palestine 1923 / Israeli CS Grid — commonly called the Israeli Old Grid.
  proj4.defs(
    "EPSG:28193",
    "+proj=cass +lat_0=31.73409694444445 +lon_0=35.21208055555556 " +
    "+x_0=170251.555 +y_0=126867.909 +a=6378300.789 +b=6356566.435 " +
    "+towgs84=-235,-85,264,0,0,0,0 +units=m +no_defs +type=crs"
  );

  const crsNames = {
    "EPSG:4326": "WGS 84 — EPSG:4326",
    "EPSG:2039": "Israeli TM Grid (ITM) — EPSG:2039",
    "EPSG:28193": "Israeli Old Grid (ICS) — EPSG:28193"
  };

  let lastConverted = null;

  function parseCoordinate(rawValue) {
    const cleaned = rawValue.trim().replace(/\s/g, "").replace(",", ".");
    const value = Number(cleaned);

    if (!Number.isFinite(value)) {
      throw new Error("Enter valid numeric values for both coordinates.");
    }

    return value;
  }

  function validateZone(rawZone) {
    const zone = Number(rawZone);

    if (!Number.isInteger(zone) || zone < 1 || zone > 60) {
      throw new Error("A UTM zone must be a whole number from 1 to 60.");
    }

    return zone;
  }

  function createUtmDefinition(zone, hemisphere) {
    const code = `CUSTOM:UTM-${zone}${hemisphere}`;

    if (!proj4.defs(code)) {
      const south = hemisphere === "S" ? " +south" : "";
      proj4.defs(
        code,
        `+proj=utm +zone=${zone}${south} +datum=WGS84 +units=m +no_defs +type=crs`
      );
    }

    return code;
  }

  function resolveCrs(side) {
    const isSource = side === "source";
    const selected = isSource ? elements.sourceCrs.value : elements.targetCrs.value;

    if (selected !== "UTM") {
      return {
        code: selected,
        label: crsNames[selected],
        type: selected === "EPSG:4326" ? "geographic" : "projected"
      };
    }

    const zone = validateZone(
      isSource ? elements.sourceZone.value : elements.targetZone.value
    );
    const hemisphere = isSource
      ? elements.sourceHemisphere.value
      : elements.targetHemisphere.value;

    return {
      code: createUtmDefinition(zone, hemisphere),
      label: `WGS 84 / UTM zone ${zone}${hemisphere}`,
      type: "projected",
      zone,
      hemisphere
    };
  }

  function validateCoordinateRange(x, y, crs) {
    if (crs.code === "EPSG:4326") {
      if (x < -180 || x > 180) {
        throw new Error("Longitude must be between -180 and 180 degrees.");
      }

      if (y < -90 || y > 90) {
        throw new Error("Latitude must be between -90 and 90 degrees.");
      }
    }
  }

  function formatCoordinate(value, crs) {
    return crs.type === "geographic" ? value.toFixed(7) : value.toFixed(3);
  }

  function showMessage(text, type = "") {
    elements.message.textContent = text;
    elements.message.className = `message ${type}`.trim();
  }

  function clearOutput() {
    elements.result.hidden = true;
    elements.resultX.textContent = "";
    elements.resultY.textContent = "";
    elements.resultCrs.textContent = "";
    lastConverted = null;
    showMessage("");
  }

  function updateUtmPanels() {
    elements.sourceUtmOptions.hidden = elements.sourceCrs.value !== "UTM";
    elements.targetUtmOptions.hidden = elements.targetCrs.value !== "UTM";
  }

  function updateInputLabels() {
    const geographic = elements.sourceCrs.value === "EPSG:4326";

    elements.xLabel.textContent = geographic ? "Longitude / X" : "Easting / X";
    elements.yLabel.textContent = geographic ? "Latitude / Y" : "Northing / Y";

    elements.x.placeholder = geographic ? "34.7818" : "180000";
    elements.y.placeholder = geographic ? "32.0853" : "665000";
  }

  function updateAllControls() {
    updateUtmPanels();
    updateInputLabels();
    clearOutput();
  }

  function crsAreEquivalent(source, target) {
    return source.code === target.code;
  }

  function convertCoordinates() {
    clearOutput();

    try {
      const source = resolveCrs("source");
      const target = resolveCrs("target");

      if (crsAreEquivalent(source, target)) {
        throw new Error("The source and target coordinate systems are identical.");
      }

      const x = parseCoordinate(elements.x.value);
      const y = parseCoordinate(elements.y.value);

      validateCoordinateRange(x, y, source);

      const converted = proj4(source.code, target.code, [x, y]);

      if (
        !Array.isArray(converted) ||
        !Number.isFinite(converted[0]) ||
        !Number.isFinite(converted[1])
      ) {
        throw new Error("The transformation did not return a valid coordinate.");
      }

      elements.resultX.textContent = formatCoordinate(converted[0], target);
      elements.resultY.textContent = formatCoordinate(converted[1], target);
      elements.resultXLabel.textContent =
        target.type === "geographic" ? "Longitude" : "Easting";
      elements.resultYLabel.textContent =
        target.type === "geographic" ? "Latitude" : "Northing";
      elements.resultCrs.textContent = target.label;
      elements.result.hidden = false;

      lastConverted = {
        x: elements.resultX.textContent,
        y: elements.resultY.textContent
      };

      showMessage("The coordinate was converted successfully.", "success");
    } catch (error) {
      showMessage(
        error instanceof Error ? error.message : "An unexpected error occurred.",
        "error"
      );
    }
  }

  function swapSystems() {
    const sourceCrsValue = elements.sourceCrs.value;
    elements.sourceCrs.value = elements.targetCrs.value;
    elements.targetCrs.value = sourceCrsValue;

    const sourceZone = elements.sourceZone.value;
    elements.sourceZone.value = elements.targetZone.value;
    elements.targetZone.value = sourceZone;

    const sourceHemisphere = elements.sourceHemisphere.value;
    elements.sourceHemisphere.value = elements.targetHemisphere.value;
    elements.targetHemisphere.value = sourceHemisphere;

    updateAllControls();
  }

  async function copyResult() {
    if (!lastConverted) {
      return;
    }

    const text = `${lastConverted.x}, ${lastConverted.y}`;

    try {
      await navigator.clipboard.writeText(text);
      showMessage("The converted coordinate was copied.", "success");
    } catch {
      showMessage(
        "Automatic copying failed. Select and copy the values manually.",
        "error"
      );
    }
  }

  function useResultAsInput() {
    if (!lastConverted) {
      return;
    }

    elements.x.value = lastConverted.x;
    elements.y.value = lastConverted.y;
    swapSystems();
  }

  document.getElementById("convert").addEventListener("click", convertCoordinates);
  document.getElementById("swap").addEventListener("click", swapSystems);
  document.getElementById("copy").addEventListener("click", copyResult);
  document.getElementById("use-result").addEventListener("click", useResultAsInput);

  [
    elements.sourceCrs,
    elements.targetCrs,
    elements.sourceZone,
    elements.targetZone,
    elements.sourceHemisphere,
    elements.targetHemisphere
  ].forEach((control) => {
    control.addEventListener("change", updateAllControls);
  });

  [elements.x, elements.y].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        convertCoordinates();
      }
    });
  });

  updateUtmPanels();
  updateInputLabels();
});
