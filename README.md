# Coordinate Converter v2.4

Version 2.4 adds advanced map tools and shareable conversion links.

## Primary cursor CRS

The coordinates-under-cursor panel now includes a selectable primary display:

- WGS 84.
- Automatic WGS 84 / UTM.
- Israeli TM Grid.
- Israeli Old Grid.
- Web Mercator.
- The currently selected source CRS.
- The currently selected target CRS.

The selected coordinate can be copied with one button. Additional WGS 84, UTM,
and ITM formats remain available in an expandable panel.

## Shareable conversion links

After a successful single-coordinate conversion, “Copy shareable link” creates
a URL containing:

- Input X and Y.
- Source CRS.
- Target CRS.
- Source UTM zone and hemisphere, when applicable.
- Target UTM settings, when applicable.
- Automatic target-UTM preference.

Opening the shared URL:

1. Restores the selected systems.
2. Restores the coordinate.
3. Opens the single-coordinate tab.
4. Runs the conversion automatically.
5. Displays the point on the map.

No coordinate data is sent to a server by this feature. It is encoded in the
URL query string, so users should not use shareable links for sensitive
locations.

## Existing functionality retained

- Local searchable CRS catalog.
- Reverse geocoding for explicit single-point requests.
- Live WGS 84, UTM, and ITM cursor coordinates.
- Excel / CSV batch conversion and XLSX downloads.
- Map previews.
- CRS and area-of-use validation.

## GitHub Pages update

Upload to the repository root:

- index.html
- style-v2.4.css
- app-v2.4.js
- README.md

The WordPress iframe URL remains unchanged. After deployment, perform a hard
refresh.
