# Coordinate System Converter — Version 1.1

This version supports conversion between:

- WGS 84 geographic coordinates — EPSG:4326
- Israeli TM Grid (ITM) — EPSG:2039
- Israeli Old Grid / Israeli CS Grid — EPSG:28193
- Any WGS 84 UTM zone from 1 to 60
- Northern and Southern UTM hemispheres

## Updating the existing GitHub Pages site

1. Extract this ZIP file.
2. Open your existing `coordinate-converter` repository on GitHub.
3. Choose **Add file → Upload files**.
4. Upload and replace:
   - `index.html`
   - `style.css`
   - `app.js`
   - `README.md`
5. Commit the changes.
6. Wait briefly for GitHub Pages to redeploy.
7. Refresh the published page, preferably with a hard refresh.

## UTM input

When UTM is selected as source or target:

- Select a zone from 1 to 60.
- Select Northern or Southern hemisphere.
- Enter projected coordinates as Easting, then Northing.

## Coordinate order

- WGS 84: Longitude, Latitude
- ITM, Israeli Old Grid and UTM: Easting, Northing

## WordPress embedding

The existing iframe does not need to change if the GitHub Pages URL remains the same.
