# Coordinate Converter v2.3

Version 2.3 combines two additions:

## 2.3A — Reverse geocoding

For a successfully converted single coordinate or a point selected on the map,
the user can explicitly click a button to look up the nearest mapped place or
address.

The lookup displays available fields such as:

- Mapped name.
- Street and house number.
- District.
- City, town, village, or municipality.
- County.
- State or region.
- Postcode.
- Country.

### Public Nominatim safeguards

This static GitHub Pages version uses the public OpenStreetMap Nominatim
reverse endpoint only for direct, user-triggered single-point requests.

The application:

- Does not automatically geocode spreadsheet rows.
- Queues lookups one at a time.
- Waits at least 1.1 seconds between network requests.
- Caches up to 250 recent results in browser local storage.
- Displays OpenStreetMap/Nominatim attribution.
- Sends coordinates only after the user clicks a lookup button.

Reverse geocoding returns the closest suitable indexed OpenStreetMap feature,
which may not always be the exact address at the coordinate.

## 2.3B — Coordinates under the cursor

Moving the mouse over the interactive map shows:

- WGS 84 longitude and latitude.
- The automatically selected WGS 84 UTM zone, hemisphere, Easting, and Northing.
- Israeli TM Grid coordinates when the cursor is inside the EPSG:2039 area of use.

These values are calculated locally with Proj4js and do not make network
geocoding requests.

## Existing functionality retained

- Searchable local CRS catalog.
- Single coordinate conversion.
- XLSX, XLS and CSV batch conversion.
- XLSX result and error-report downloads.
- Input, area-of-use, UTM, and round-trip validation.
- Interactive Leaflet maps.

## GitHub Pages update

Upload to the repository root:

- index.html
- style-v2.3.css
- app-v2.3.js
- README.md

The WordPress iframe URL remains unchanged. After GitHub Pages finishes
deploying, perform a hard refresh.
