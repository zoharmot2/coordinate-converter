document.addEventListener("DOMContentLoaded", () => {
  const source = document.getElementById("source-crs");
  const target = document.getElementById("target-crs");
  const xInput = document.getElementById("x");
  const yInput = document.getElementById("y");
  const xLabel = document.getElementById("x-label");
  const yLabel = document.getElementById("y-label");
  const message = document.getElementById("message");
  const result = document.getElementById("result");
  const resultX = document.getElementById("result-x");
  const resultY = document.getElementById("result-y");

  if (typeof proj4 === "undefined") {
    showMessage("ספריית ההמרה לא נטענה. בדקו את החיבור לאינטרנט ורעננו את הדף.", "error");
    return;
  }

  // Israel 1993 / Israeli TM Grid (ITM)
  proj4.defs(
    "EPSG:2039",
    "+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 " +
    "+k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 " +
    "+towgs84=-48,55,52,0,0,0,0 +units=m +no_defs +type=crs"
  );

  // WGS 84 / UTM zone 36N
  proj4.defs(
    "EPSG:32636",
    "+proj=utm +zone=36 +datum=WGS84 +units=m +no_defs +type=crs"
  );

  function parseNumber(rawValue) {
    const cleaned = rawValue.trim().replace(/\s/g, "").replace(",", ".");
    const value = Number(cleaned);

    if (!Number.isFinite(value)) {
      throw new Error("יש להזין שני ערכים מספריים תקינים.");
    }

    return value;
  }

  function validate(x, y, sourceCrs) {
    if (sourceCrs === "EPSG:4326") {
      if (x < -180 || x > 180) {
        throw new Error("Longitude חייב להיות בין ‎-180 ל־180.");
      }
      if (y < -90 || y > 90) {
        throw new Error("Latitude חייב להיות בין ‎-90 ל־90.");
      }
    }
  }

  function format(value, crs) {
    return crs === "EPSG:4326" ? value.toFixed(7) : value.toFixed(3);
  }

  function showMessage(text, type = "") {
    message.textContent = text;
    message.className = `message ${type}`.trim();
  }

  function clearOutput() {
    result.hidden = true;
    resultX.textContent = "";
    resultY.textContent = "";
    showMessage("");
  }

  function updateLabels() {
    const geographic = source.value === "EPSG:4326";
    xLabel.textContent = geographic ? "Longitude / X" : "Easting / X";
    yLabel.textContent = geographic ? "Latitude / Y" : "Northing / Y";
  }

  function convert() {
    clearOutput();

    try {
      if (source.value === target.value) {
        throw new Error("מערכת המקור ומערכת היעד זהות.");
      }

      const x = parseNumber(xInput.value);
      const y = parseNumber(yInput.value);
      validate(x, y, source.value);

      const converted = proj4(source.value, target.value, [x, y]);

      if (!Array.isArray(converted) ||
          !Number.isFinite(converted[0]) ||
          !Number.isFinite(converted[1])) {
        throw new Error("לא התקבלה תוצאה תקינה.");
      }

      resultX.textContent = format(converted[0], target.value);
      resultY.textContent = format(converted[1], target.value);
      result.hidden = false;
      showMessage("ההמרה הושלמה.", "success");
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "אירעה שגיאה.", "error");
    }
  }

  document.getElementById("convert").addEventListener("click", convert);

  document.getElementById("swap").addEventListener("click", () => {
    const oldSource = source.value;
    source.value = target.value;
    target.value = oldSource;
    clearOutput();
    updateLabels();
  });

  document.getElementById("copy").addEventListener("click", async () => {
    const text = `${resultX.textContent}, ${resultY.textContent}`;

    try {
      await navigator.clipboard.writeText(text);
      showMessage("התוצאה הועתקה.", "success");
    } catch {
      showMessage("ההעתקה האוטומטית נכשלה. ניתן לסמן ולהעתיק ידנית.", "error");
    }
  });

  source.addEventListener("change", () => {
    clearOutput();
    updateLabels();
  });

  target.addEventListener("change", clearOutput);

  [xInput, yInput].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        convert();
      }
    });
  });

  updateLabels();
});
