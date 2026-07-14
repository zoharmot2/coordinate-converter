# Coordinate Converter v2.2

Version 2.2 adds a searchable local EPSG/CRS catalog while retaining:

- Single-coordinate conversion.
- Excel / CSV batch conversion and XLSX export.
- Input and area-of-use validation.
- Interactive Leaflet maps.
- Automatic and manually validated UTM zones.

## Searchable CRS catalog

Search source and target systems by EPSG code, name, or common alias.

Supported in this release:

- EPSG:4326 — WGS 84.
- EPSG:3857 — WGS 84 / Pseudo-Mercator (Web Mercator).
- EPSG:2039 — Israeli TM Grid (ITM).
- EPSG:28193 — Israeli Old Grid / Israeli CS Grid.
- EPSG:27700 — OSGB36 / British National Grid.
- EPSG:2154 — RGF93 v1 / Lambert-93.
- WGS 84 / UTM zones 1–60, northern and southern hemispheres.

The search is local and does not require an API key or send search text to a
remote service.

## Validation

Each supported projected CRS has:

- Expected projected coordinate bounds.
- Geographic area-of-use bounds.
- Coordinate-order checks.
- Inverse geographic checks.
- Transformation round-trip consistency checks.

For EPSG:27700, the browser implementation uses a standard Helmert datum
transformation. High-accuracy British surveying work should use the official
OSTN grid transformation in specialist GIS or surveying software.

## GitHub Pages update

Upload to the repository root:

- index.html
- style-v2.2.css
- app-v2.2.js
- README.md

The WordPress iframe URL remains unchanged. After committing, wait for the
GitHub Pages deployment and hard-refresh the page.
