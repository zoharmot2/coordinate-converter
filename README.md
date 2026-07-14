# Coordinate Converter v2.0

Version 2.0 adds browser-based spreadsheet conversion while retaining the
single-coordinate converter and validation from version 1.4.

## Features

- Single-coordinate conversion.
- Upload XLSX, XLS, or CSV.
- Select worksheet and header row.
- Select X and Y columns.
- Preview the first 10 records.
- Convert up to 50,000 data rows.
- Preserve all original columns.
- Add:
  - Converted_X
  - Converted_Y
  - Source_CRS
  - Target_CRS
  - Target_UTM_Zone
  - Target_UTM_Hemisphere
  - Conversion_Status
  - Conversion_Message
- Invalid rows are retained and marked ERROR.
- Download converted XLSX.
- Download a separate error report.
- Download a starter Excel template.
- All processing is performed locally in the browser.

## GitHub Pages update

Upload these files to the repository root:

- index.html
- style-v2.0.css
- app-v2.0.js
- README.md

The existing WordPress iframe URL does not change.

After committing the files, wait for GitHub Pages deployment and perform a hard
refresh:

- Windows: Ctrl+F5
- macOS: Command+Shift+R

## Important batch behavior

If the target CRS is UTM and automatic selection is enabled, each spreadsheet
row is assigned its correct UTM zone. The selected zone and hemisphere are
written to the output columns.

If the source CRS is UTM, all rows are expected to use the one selected source
zone and hemisphere.
