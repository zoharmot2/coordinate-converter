# Coordinate System Converter v1.2 — Fixed

This release fixes:

1. UTM zone and hemisphere controls not appearing.
2. Old cached JavaScript continuing to run.
3. Incorrect Israeli Old Grid false northing.
4. Incorrect datum transformation parameters for EPSG:2039 and EPSG:28193.

## Important update instructions

Upload all four files to the root of the existing GitHub repository:

- index.html
- style-v1.2.css
- app-v1.2.js
- README.md

The new CSS and JavaScript filenames intentionally differ from the earlier release.
This prevents the browser and GitHub Pages from reusing the old cached files.

You may delete the old `style.css` and `app.js`, although this is not required.

After committing the files:

1. Wait for GitHub Pages deployment to complete.
2. Open the page.
3. Perform a hard refresh: Ctrl+F5 on Windows or Command+Shift+R on macOS.

## Test

For longitude 35.2 and latitude 32.6:

- Source: WGS 84
- Target: UTM
- Zone: 36
- Hemisphere: Northern

The UTM selectors should appear immediately after choosing UTM.
