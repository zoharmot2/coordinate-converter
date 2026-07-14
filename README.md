# Coordinate Converter v2.1

Version 2.1 adds interactive Leaflet maps to the validated single-coordinate
and spreadsheet converter introduced in version 2.0.

## New map features

### Single coordinate

- Displays every successfully converted coordinate on an interactive map.
- Clicking the map selects a WGS 84 longitude/latitude.
- “Use map point as input” changes the source CRS to WGS 84 and copies the
  clicked location into the coordinate fields.
- Marker popup shows longitude and latitude.
- “Clear point” removes the selected marker.

### Excel / CSV

- After batch conversion, valid records are shown on a map.
- Up to 1,000 successful records are rendered to protect browser performance.
- The map automatically zooms to the displayed points.
- Clicking a point shows its spreadsheet row and WGS 84 location.
- All rows are still written to the output workbook; the 1,000-point limit
  applies only to the visual preview.

## Libraries

- Proj4js for coordinate transformation.
- SheetJS for browser-based spreadsheet reading and writing.
- Leaflet 1.9.4 for maps.
- OpenStreetMap standard tiles for normal interactive viewing.

## GitHub Pages update

Upload these files to the repository root:

- index.html
- style-v2.1.css
- app-v2.1.js
- README.md

The WordPress iframe URL does not change.

After committing:

1. Wait for GitHub Pages deployment.
2. Hard-refresh the page:
   - Windows: Ctrl+F5
   - macOS: Command+Shift+R
3. The iframe may need a greater height because the map adds vertical content.
   A starting value of 1500–1700 px is reasonable.
