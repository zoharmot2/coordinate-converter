# Coordinate System Converter v1.3 — UTM validation

## Fixes

- Automatically determines the correct UTM zone from longitude and latitude.
- Automatically determines northern or southern hemisphere.
- Blocks conversion when a manually selected UTM zone is incompatible with the location.
- Validates a declared source UTM zone after converting it back to WGS 84.
- Supports the standard Norway and Svalbard UTM zone exceptions.
- Warns when latitude is outside the normal UTM coverage of 80°S to 84°N.

## Example

Longitude 35°, latitude 32.5° belongs to UTM zone 36N.
The tool will no longer accept zone 57N for this location.

## Upload

Replace `index.html` and upload:

- `style-v1.3.css`
- `app-v1.3.js`
- `README.md`

The versioned filenames avoid browser cache problems.
