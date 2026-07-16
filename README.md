# Coordinate Converter v2.5.1

Coordinate Converter 2.5 is the Global CRS Expansion and Documentation release.

## New in 2.5

- Adds 25 global, continental and national coordinate reference systems.
- Retains WGS 84, Web Mercator, ITM, ICS, dynamic UTM, British National Grid and Lambert-93.
- Supports every listed CRS in single-point and Excel/CSV batch conversion.
- Adds a dedicated **CRS documentation** tab.
- All documentation content is written and displayed in English only.
- Documentation can be searched by name, EPSG code, datum, projection or region.
- Documentation entries include type, datum, projection, units, area of use, input order, common uses and limitations.

## Accuracy

The application is suitable for general GIS, education and data integration. Some legacy datum transformations are implemented with browser-compatible Helmert parameters. Surveying, cadastral and other high-accuracy work should be verified against an authoritative national geodetic service and may require transformation grid files.

## Deployment

Upload these files to the repository root:

- `index.html`
- `style-v2.5.css`
- `app-v2.5.js`
- `README.md`

Use a cache-busting query such as `?v=2.5.1` and hard-refresh after deployment.


## Version 2.5.1 interface refinement

The former standalone **Supported CRS catalog** section has been merged into the **CRS documentation** tab. The documentation tab is now the single place for browsing, searching and reviewing all supported coordinate systems.
