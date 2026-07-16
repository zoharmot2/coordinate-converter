document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const MAX_ROWS = 50000;
  const PREVIEW_ROWS = 10;
  const $ = (id) => document.getElementById(id);

  if (typeof proj4 === "undefined") {
    document.body.innerHTML = "<p>The transformation library could not be loaded.</p>";
    return;
  }
  if (typeof XLSX === "undefined") {
    document.body.innerHTML = "<p>The spreadsheet library could not be loaded.</p>";
    return;
  }
  if (typeof L === "undefined") {
    document.body.innerHTML = "<p>The map library could not be loaded.</p>";
    return;
  }

  proj4.defs(
    "EPSG:2039",
    "+proj=tmerc +lat_0=31.7343936111111 +lon_0=35.2045169444444 " +
    "+k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 " +
    "+towgs84=23.772,17.49,17.859,-0.3132,-1.85274,1.67299,-5.4262 " +
    "+units=m +no_defs +type=crs"
  );

  proj4.defs(
    "EPSG:28193",
    "+proj=cass +lat_0=31.7340969444444 +lon_0=35.2120805555556 " +
    "+x_0=170251.555 +y_0=1126867.909 +a=6378300.789 +b=6356566.435 " +
    "+towgs84=-275.7224,94.7824,340.8944,-8.001,-4.42,-11.821,1 " +
    "+units=m +no_defs +type=crs"
  );

  proj4.defs(
    "EPSG:3857",
    "+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 " +
    "+x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext " +
    "+no_defs +type=crs"
  );

  proj4.defs(
    "EPSG:27700",
    "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 " +
    "+x_0=400000 +y_0=-100000 +ellps=airy " +
    "+towgs84=446.448,-125.157,542.06,0.1502,0.247,0.8421,-20.4894 " +
    "+units=m +no_defs +type=crs"
  );

  proj4.defs(
    "EPSG:2154",
    "+proj=lcc +lat_0=46.5 +lon_0=3 +lat_1=49 +lat_2=44 " +
    "+x_0=700000 +y_0=6600000 +ellps=GRS80 " +
    "+units=m +no_defs +type=crs"
  );

  // Version 2.5 — 25 additional global and national CRS definitions
  proj4.defs("EPSG:3395", "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:8857", "+proj=eqearth +lon_0=0 +datum=WGS84 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:3413", "+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:3031", "+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:4258", "+proj=longlat +ellps=GRS80 +no_defs +type=crs");
  proj4.defs("EPSG:3035", "+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:3034", "+proj=lcc +lat_0=52 +lon_0=10 +lat_1=35 +lat_2=65 +x_0=4000000 +y_0=2800000 +ellps=GRS80 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:4269", "+proj=longlat +datum=NAD83 +no_defs +type=crs");
  proj4.defs("EPSG:4267", "+proj=longlat +datum=NAD27 +no_defs +type=crs");
  proj4.defs("EPSG:5070", "+proj=aea +lat_0=23 +lon_0=-96 +lat_1=29.5 +lat_2=45.5 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:3347", "+proj=lcc +lat_0=63.390675 +lon_0=-91.8666666666667 +lat_1=49 +lat_2=77 +x_0=6200000 +y_0=3000000 +datum=NAD83 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:6372", "+proj=lcc +lat_0=12 +lon_0=-102 +lat_1=17.5 +lat_2=29.5 +x_0=2500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:28992", "+proj=sterea +lat_0=52.1561605555556 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.4171,50.3319,465.5524,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:2056", "+proj=somerc +lat_0=46.9524055555556 +lon_0=7.43958333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:31287", "+proj=lcc +lat_0=47.5 +lon_0=13.3333333333333 +lat_1=49 +lat_2=46 +x_0=400000 +y_0=400000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:2180", "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:2100", "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=-199.87,74.79,246.62,0,0,0,0 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:2157", "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=0.99982 +x_0=600000 +y_0=750000 +ellps=GRS80 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:3003", "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +towgs84=-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:28407", "+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=7500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,0,0,0,-0.12 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:9473", "+proj=aea +lat_0=0 +lon_0=132 +lat_1=-18 +lat_2=-36 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:2193", "+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:4548", "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:5179", "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:6677", "+proj=tmerc +lat_0=36 +lon_0=139.833333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");

  const ISRAEL_AREA = { west: 34.17, south: 29.45, east: 35.69, north: 33.28 };

  const CRS_CATALOG = [
    {
      key: "EPSG:4326",
      code: "EPSG:4326",
      epsg: "4326",
      name: "WGS 84",
      aliases: ["geographic", "longitude latitude", "lon lat", "gps"],
      type: "geographic",
      area: { west: -180, south: -90, east: 180, north: 90 },
      xMin: -180, xMax: 180, yMin: -90, yMax: 90,
      xName: "Longitude", yName: "Latitude",
      help: "Expected: longitude −180° to 180°; latitude −90° to 90°.", category: "Global", datum: "WGS 84", projection: "Geographic 2D", unit: "degrees", documentation: { region: "Global", summary: "WGS 84 is the global geographic reference system used by GPS, web services and most interoperable longitude/latitude datasets.", commonUses: "GPS positions, GeoJSON, global data exchange and web mapping inputs.", limitations: "The application uses longitude first and latitude second. Geographic degrees are not suitable for direct distance or area measurement." }
    },
    {
      key: "EPSG:3857",
      code: "EPSG:3857",
      epsg: "3857",
      name: "WGS 84 / Pseudo-Mercator",
      aliases: ["web mercator", "google mercator", "osm", "slippy map"],
      type: "projected",
      area: { west: -180, south: -85.06, east: 180, north: 85.06 },
      xMin: -20037508.35, xMax: 20037508.35,
      yMin: -20048966.11, yMax: 20048966.11,
      xName: "Easting", yName: "Northing",
      help: "Expected Web Mercator metres; latitude coverage is approximately 85.06°S–85.06°N.", category: "Global", datum: "WGS 84 ensemble", projection: "Popular Visualisation Pseudo-Mercator", unit: "metres", documentation: { region: "Global", summary: "Web Mercator is the standard projected CRS for interactive web maps and tiled basemaps.", commonUses: "Online basemaps, slippy maps, browser mapping and tile services.", limitations: "Area and distance distortion increase strongly toward the poles. It is intended for display, not precision measurement." }
    },
    {
      key: "EPSG:2039",
      code: "EPSG:2039",
      epsg: "2039",
      name: "Israeli TM Grid (ITM)",
      aliases: ["israel new grid", "itm", "israel tm"],
      type: "projected",
      area: ISRAEL_AREA,
      xMin: 119097.33, xMax: 266563.36,
      yMin: 373609.64, yMax: 798747.07,
      xName: "Easting", yName: "Northing",
      help: "Expected: Easting 119,097–266,563 m; Northing 373,610–798,747 m.", category: "Israel", datum: "Israel 1993", projection: "Transverse Mercator", unit: "metres", documentation: { region: "Israel", summary: "The Israeli Transverse Mercator grid is the modern national projected CRS used for most Israeli GIS and mapping datasets.", commonUses: "National mapping, planning, infrastructure, environmental analysis and Israeli government spatial data.", limitations: "Use an authoritative Survey of Israel service for cadastral or survey-grade transformations." }
    },
    {
      key: "EPSG:28193",
      code: "EPSG:28193",
      epsg: "28193",
      name: "Israeli Old Grid (ICS)",
      aliases: ["israel old grid", "ics", "israeli cs grid", "palestine 1923"],
      type: "projected",
      area: ISRAEL_AREA,
      xMin: 69099.91, xMax: 216561.80,
      yMin: 873606.74, yMax: 1298746.25,
      xName: "Easting", yName: "Northing",
      help: "Expected: Easting 69,100–216,562 m; Northing 873,607–1,298,746 m.", category: "Israel", datum: "Palestine 1923", projection: "Cassini-Soldner", unit: "metres", documentation: { region: "Israel / historical Palestine", summary: "The Israeli Old Grid is a legacy Cassini-Soldner system derived from the Palestine 1923 framework.", commonUses: "Historical maps, archival records, legacy Israeli datasets and archaeological research.", limitations: "It is a legacy datum and projection. Transformation accuracy may vary, especially for historical source material." }
    },
    {
      key: "EPSG:27700",
      code: "EPSG:27700",
      epsg: "27700",
      name: "OSGB36 / British National Grid",
      aliases: ["british national grid", "bng", "osgb", "great britain", "uk grid"],
      type: "projected",
      area: { west: -9.01, south: 49.75, east: 2.01, north: 61.01 },
      xMin: -110000, xMax: 710000,
      yMin: -20000, yMax: 1270000,
      xName: "Easting", yName: "Northing",
      help: "Expected British National Grid metres within Great Britain and its EPSG area of use.", category: "Great Britain", datum: "OSGB36", projection: "Transverse Mercator", unit: "metres", documentation: { region: "Great Britain", summary: "British National Grid is the national projected coordinate system used for detailed mapping in Great Britain.", commonUses: "Ordnance Survey mapping, local government GIS, planning and environmental datasets.", limitations: "The browser-compatible Helmert transformation is less accurate than OSTN grid-based transformations used by authoritative services." }
    },
    {
      key: "EPSG:2154",
      code: "EPSG:2154",
      epsg: "2154",
      name: "RGF93 v1 / Lambert-93",
      aliases: ["lambert 93", "lambert-93", "france", "rgf93"],
      type: "projected",
      area: { west: -9.86, south: 41.15, east: 10.38, north: 51.56 },
      xMin: 40047.98, xMax: 1256237.17,
      yMin: 6023107.63, yMax: 7143566.38,
      xName: "Easting", yName: "Northing",
      help: "Expected Lambert-93 metres within metropolitan France and Corsica.", category: "France", datum: "RGF93 v1", projection: "Lambert Conformal Conic", unit: "metres", documentation: { region: "France", summary: "Lambert-93 is the standard projected CRS for metropolitan France and Corsica.", commonUses: "French national mapping, public open data, planning and environmental GIS.", limitations: "Use within its French area of use; overseas territories use other coordinate systems." }
    },
    {
      key: "EPSG:3395", code: "EPSG:3395", epsg: "3395",
      name: "WGS 84 / World Mercator", aliases: ["global", "mercator (variant a)", "wgs 84"],
      type: "projected", category: "Global", datum: "WGS 84", projection: "Mercator (variant A)", unit: "metres",
      area: { west: -180, south: -80, east: 180, north: 84 },
      xMin: -20037509, xMax: 20037509, yMin: -15496571, yMax: 18764657,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for Global.",
      documentation: { region: "Global", summary: "WGS 84 / World Mercator is a Mercator (variant A) coordinate reference system based on WGS 84.", commonUses: "General-purpose global projected mapping", limitations: "Not suitable for polar regions or accurate area measurement." }
    },
    {
      key: "EPSG:8857", code: "EPSG:8857", epsg: "8857",
      name: "WGS 84 / Equal Earth Greenwich", aliases: ["global", "equal earth", "wgs 84"],
      type: "projected", category: "Global", datum: "WGS 84", projection: "Equal Earth", unit: "metres",
      area: { west: -180, south: -90, east: 180, north: 90 },
      xMin: -17243960, xMax: 17243960, yMin: -8392928, yMax: 8392928,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for Global.",
      documentation: { region: "Global", summary: "WGS 84 / Equal Earth Greenwich is a Equal Earth coordinate reference system based on WGS 84.", commonUses: "Equal-area world maps and thematic cartography", limitations: "Shapes are generalized; not intended for local surveying." }
    },
    {
      key: "EPSG:3413", code: "EPSG:3413", epsg: "3413",
      name: "WGS 84 / NSIDC Sea Ice Polar Stereographic North", aliases: ["arctic", "polar stereographic", "wgs 84"],
      type: "projected", category: "Arctic", datum: "WGS 84", projection: "Polar Stereographic", unit: "metres",
      area: { west: -180, south: 60, east: 180, north: 90 },
      xMin: -5000000, xMax: 5000000, yMin: -5000000, yMax: 5000000,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for Arctic.",
      documentation: { region: "Arctic", summary: "WGS 84 / NSIDC Sea Ice Polar Stereographic North is a Polar Stereographic coordinate reference system based on WGS 84.", commonUses: "Arctic sea-ice, climate and polar research", limitations: "Use only in the northern polar region." }
    },
    {
      key: "EPSG:3031", code: "EPSG:3031", epsg: "3031",
      name: "WGS 84 / Antarctic Polar Stereographic", aliases: ["antarctica", "polar stereographic", "wgs 84"],
      type: "projected", category: "Antarctica", datum: "WGS 84", projection: "Polar Stereographic", unit: "metres",
      area: { west: -180, south: -90, east: 180, north: -60 },
      xMin: -5000000, xMax: 5000000, yMin: -5000000, yMax: 5000000,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for Antarctica.",
      documentation: { region: "Antarctica", summary: "WGS 84 / Antarctic Polar Stereographic is a Polar Stereographic coordinate reference system based on WGS 84.", commonUses: "Antarctic mapping and polar science", limitations: "Use only in the southern polar region." }
    },
    {
      key: "EPSG:4258", code: "EPSG:4258", epsg: "4258",
      name: "ETRS89", aliases: ["europe", "geographic 2d", "etrs89"],
      type: "geographic", category: "Europe", datum: "ETRS89", projection: "Geographic 2D", unit: "degrees",
      area: { west: -16.1, south: 32.88, east: 40.18, north: 84.73 },
      xMin: -180, xMax: 180, yMin: -90, yMax: 90,
      xName: "Longitude", yName: "Latitude",
      help: "Expected longitude/latitude in decimal degrees.",
      documentation: { region: "Europe", summary: "ETRS89 is a Geographic 2D coordinate reference system based on ETRS89.", commonUses: "European geographic data and reference coordinates", limitations: "Coordinates are entered as longitude first, latitude second in this application." }
    },
    {
      key: "EPSG:3035", code: "EPSG:3035", epsg: "3035",
      name: "ETRS89-extended / LAEA Europe", aliases: ["europe", "lambert azimuthal equal area", "etrs89"],
      type: "projected", category: "Europe", datum: "ETRS89", projection: "Lambert Azimuthal Equal Area", unit: "metres",
      area: { west: -35.58, south: 24.6, east: 44.83, north: 84.73 },
      xMin: 900000, xMax: 7400000, yMin: 900000, yMax: 5500000,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for Europe.",
      documentation: { region: "Europe", summary: "ETRS89-extended / LAEA Europe is a Lambert Azimuthal Equal Area coordinate reference system based on ETRS89.", commonUses: "Pan-European statistics, environment and area analysis", limitations: "Best used for Europe-wide analysis rather than local cadastral work." }
    },
    {
      key: "EPSG:3034", code: "EPSG:3034", epsg: "3034",
      name: "ETRS89-extended / LCC Europe", aliases: ["europe", "lambert conformal conic", "etrs89"],
      type: "projected", category: "Europe", datum: "ETRS89", projection: "Lambert Conformal Conic", unit: "metres",
      area: { west: -35.58, south: 24.6, east: 44.83, north: 84.73 },
      xMin: 1000000, xMax: 7000000, yMin: 500000, yMax: 5500000,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for Europe.",
      documentation: { region: "Europe", summary: "ETRS89-extended / LCC Europe is a Lambert Conformal Conic coordinate reference system based on ETRS89.", commonUses: "Small- and medium-scale pan-European mapping", limitations: "Not an equal-area projection." }
    },
    {
      key: "EPSG:4269", code: "EPSG:4269", epsg: "4269",
      name: "NAD83", aliases: ["north america", "geographic 2d", "nad83"],
      type: "geographic", category: "North America", datum: "NAD83", projection: "Geographic 2D", unit: "degrees",
      area: { west: -172.54, south: 14.92, east: -47.74, north: 86.46 },
      xMin: -180, xMax: 180, yMin: -90, yMax: 90,
      xName: "Longitude", yName: "Latitude",
      help: "Expected longitude/latitude in decimal degrees.",
      documentation: { region: "North America", summary: "NAD83 is a Geographic 2D coordinate reference system based on NAD83.", commonUses: "North American geographic datasets", limitations: "Datum realization and local transformation accuracy may vary." }
    },
    {
      key: "EPSG:4267", code: "EPSG:4267", epsg: "4267",
      name: "NAD27", aliases: ["north america", "geographic 2d", "nad27"],
      type: "geographic", category: "North America", datum: "NAD27", projection: "Geographic 2D", unit: "degrees",
      area: { west: -172.54, south: 7.15, east: -47.74, north: 83.17 },
      xMin: -180, xMax: 180, yMin: -90, yMax: 90,
      xName: "Longitude", yName: "Latitude",
      help: "Expected longitude/latitude in decimal degrees.",
      documentation: { region: "North America", summary: "NAD27 is a Geographic 2D coordinate reference system based on NAD27.", commonUses: "Legacy mapping in the United States, Canada and Mexico", limitations: "High-accuracy conversion may require NADCON grid files unavailable in a browser-only workflow." }
    },
    {
      key: "EPSG:5070", code: "EPSG:5070", epsg: "5070",
      name: "NAD83 / Conus Albers", aliases: ["united states", "albers equal area", "nad83"],
      type: "projected", category: "United States", datum: "NAD83", projection: "Albers Equal Area", unit: "metres",
      area: { west: -124.79, south: 24.41, east: -66.91, north: 49.38 },
      xMin: -3000000, xMax: 3000000, yMin: 0, yMax: 3500000,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for United States.",
      documentation: { region: "United States", summary: "NAD83 / Conus Albers is a Albers Equal Area coordinate reference system based on NAD83.", commonUses: "CONUS environmental, statistical and area analysis", limitations: "Intended for the contiguous United States." }
    },
    {
      key: "EPSG:3347", code: "EPSG:3347", epsg: "3347",
      name: "NAD83 / Statistics Canada Lambert", aliases: ["canada", "lambert conformal conic", "nad83"],
      type: "projected", category: "Canada", datum: "NAD83", projection: "Lambert Conformal Conic", unit: "metres",
      area: { west: -141.01, south: 40.04, east: -47.74, north: 86.46 },
      xMin: 3000000, xMax: 9000000, yMin: 500000, yMax: 6500000,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for Canada.",
      documentation: { region: "Canada", summary: "NAD83 / Statistics Canada Lambert is a Lambert Conformal Conic coordinate reference system based on NAD83.", commonUses: "National Canadian statistics and mapping", limitations: "Use Canadian authoritative services where survey-grade accuracy is required." }
    },
    {
      key: "EPSG:6372", code: "EPSG:6372", epsg: "6372",
      name: "Mexico ITRF2008 / LCC", aliases: ["mexico", "lambert conformal conic", "mexico itrf2008"],
      type: "projected", category: "Mexico", datum: "Mexico ITRF2008", projection: "Lambert Conformal Conic", unit: "metres",
      area: { west: -118.37, south: 14.51, east: -86.71, north: 32.72 },
      xMin: 1000000, xMax: 4000000, yMin: 0, yMax: 2500000,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for Mexico.",
      documentation: { region: "Mexico", summary: "Mexico ITRF2008 / LCC is a Lambert Conformal Conic coordinate reference system based on Mexico ITRF2008.", commonUses: "National mapping and geospatial data in Mexico", limitations: "Verify datum epoch requirements for precision applications." }
    },
    {
      key: "EPSG:28992", code: "EPSG:28992", epsg: "28992",
      name: "Amersfoort / RD New", aliases: ["netherlands", "oblique stereographic", "amersfoort"],
      type: "projected", category: "Netherlands", datum: "Amersfoort", projection: "Oblique Stereographic", unit: "metres",
      area: { west: 3.2, south: 50.75, east: 7.22, north: 53.7 },
      xMin: -100000, xMax: 400000, yMin: 200000, yMax: 650000,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for Netherlands.",
      documentation: { region: "Netherlands", summary: "Amersfoort / RD New is a Oblique Stereographic coordinate reference system based on Amersfoort.", commonUses: "Dutch national mapping and open government data", limitations: "Browser transformation uses a Helmert approximation; official grids may provide higher accuracy." }
    },
    {
      key: "EPSG:2056", code: "EPSG:2056", epsg: "2056",
      name: "CH1903+ / LV95", aliases: ["switzerland", "swiss oblique mercator", "ch1903+"],
      type: "projected", category: "Switzerland", datum: "CH1903+", projection: "Swiss Oblique Mercator", unit: "metres",
      area: { west: 5.96, south: 45.82, east: 10.49, north: 47.81 },
      xMin: 2400000, xMax: 2850000, yMin: 1050000, yMax: 1350000,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for Switzerland.",
      documentation: { region: "Switzerland", summary: "CH1903+ / LV95 is a Swiss Oblique Mercator coordinate reference system based on CH1903+.", commonUses: "Modern Swiss national mapping", limitations: "Official Swiss transformations should be used for cadastral accuracy." }
    },
    {
      key: "EPSG:31287", code: "EPSG:31287", epsg: "31287",
      name: "MGI / Austria Lambert", aliases: ["austria", "lambert conformal conic", "mgi"],
      type: "projected", category: "Austria", datum: "MGI", projection: "Lambert Conformal Conic", unit: "metres",
      area: { west: 9.53, south: 46.4, east: 17.17, north: 49.02 },
      xMin: 0, xMax: 1000000, yMin: 0, yMax: 1000000,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for Austria.",
      documentation: { region: "Austria", summary: "MGI / Austria Lambert is a Lambert Conformal Conic coordinate reference system based on MGI.", commonUses: "Austrian national and legacy datasets", limitations: "A legacy datum; local grid transformations may improve accuracy." }
    },
    {
      key: "EPSG:2180", code: "EPSG:2180", epsg: "2180",
      name: "ETRS89 / Poland CS92", aliases: ["poland", "transverse mercator", "etrs89"],
      type: "projected", category: "Poland", datum: "ETRS89", projection: "Transverse Mercator", unit: "metres",
      area: { west: 14.14, south: 49, east: 24.15, north: 54.89 },
      xMin: 100000, xMax: 900000, yMin: 100000, yMax: 900000,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for Poland.",
      documentation: { region: "Poland", summary: "ETRS89 / Poland CS92 is a Transverse Mercator coordinate reference system based on ETRS89.", commonUses: "National Polish GIS and mapping", limitations: "Intended for Poland." }
    },
    {
      key: "EPSG:2100", code: "EPSG:2100", epsg: "2100",
      name: "GGRS87 / Greek Grid", aliases: ["greece", "transverse mercator", "ggrs87"],
      type: "projected", category: "Greece", datum: "GGRS87", projection: "Transverse Mercator", unit: "metres",
      area: { west: 19.57, south: 34.88, east: 28.3, north: 41.75 },
      xMin: 100000, xMax: 900000, yMin: 3800000, yMax: 4700000,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for Greece.",
      documentation: { region: "Greece", summary: "GGRS87 / Greek Grid is a Transverse Mercator coordinate reference system based on GGRS87.", commonUses: "Greek national mapping and cadastral datasets", limitations: "Use authoritative Greek transformations for survey-grade work." }
    },
    {
      key: "EPSG:2157", code: "EPSG:2157", epsg: "2157",
      name: "IRENET95 / Irish Transverse Mercator", aliases: ["ireland", "transverse mercator", "irenet95"],
      type: "projected", category: "Ireland", datum: "IRENET95", projection: "Transverse Mercator", unit: "metres",
      area: { west: -10.56, south: 51.39, east: -5.34, north: 55.43 },
      xMin: 400000, xMax: 800000, yMin: 500000, yMax: 1000000,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for Ireland.",
      documentation: { region: "Ireland", summary: "IRENET95 / Irish Transverse Mercator is a Transverse Mercator coordinate reference system based on IRENET95.", commonUses: "Modern Irish national mapping", limitations: "Intended for Ireland and Northern Ireland coverage defined by EPSG." }
    },
    {
      key: "EPSG:3003", code: "EPSG:3003", epsg: "3003",
      name: "Monte Mario / Italy zone 1", aliases: ["italy west", "transverse mercator (gauss-boaga)", "monte mario"],
      type: "projected", category: "Italy west", datum: "Monte Mario", projection: "Transverse Mercator (Gauss-Boaga)", unit: "metres",
      area: { west: 5.94, south: 34.76, east: 12, north: 47.1 },
      xMin: 1200000, xMax: 1800000, yMin: 3800000, yMax: 5300000,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for Italy west.",
      documentation: { region: "Italy west", summary: "Monte Mario / Italy zone 1 is a Transverse Mercator (Gauss-Boaga) coordinate reference system based on Monte Mario.", commonUses: "Legacy Italian mapping, western zone", limitations: "Legacy datum and zoned system; confirm whether zone 1 is appropriate." }
    },
    {
      key: "EPSG:28407", code: "EPSG:28407", epsg: "28407",
      name: "Pulkovo 1942 / Gauss-Kruger zone 7", aliases: ["eastern europe / russia", "transverse mercator", "pulkovo 1942"],
      type: "projected", category: "Eastern Europe / Russia", datum: "Pulkovo 1942", projection: "Transverse Mercator", unit: "metres",
      area: { west: 36, south: 0, east: 42, north: 84 },
      xMin: 7000000, xMax: 8000000, yMin: 0, yMax: 10000000,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for Eastern Europe / Russia.",
      documentation: { region: "Eastern Europe / Russia", summary: "Pulkovo 1942 / Gauss-Kruger zone 7 is a Transverse Mercator coordinate reference system based on Pulkovo 1942.", commonUses: "Legacy Soviet and eastern European datasets in zone 7", limitations: "Legacy datum; transformation parameters vary by region." }
    },
    {
      key: "EPSG:9473", code: "EPSG:9473", epsg: "9473",
      name: "GDA2020 / Australian Albers", aliases: ["australia", "albers equal area", "gda2020"],
      type: "projected", category: "Australia", datum: "GDA2020", projection: "Albers Equal Area", unit: "metres",
      area: { west: 112.85, south: -43.7, east: 153.69, north: -9.86 },
      xMin: -3000000, xMax: 3000000, yMin: -5000000, yMax: 0,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for Australia.",
      documentation: { region: "Australia", summary: "GDA2020 / Australian Albers is a Albers Equal Area coordinate reference system based on GDA2020.", commonUses: "National Australian area and environmental analysis", limitations: "Not intended for local engineering surveys." }
    },
    {
      key: "EPSG:2193", code: "EPSG:2193", epsg: "2193",
      name: "NZGD2000 / New Zealand Transverse Mercator 2000", aliases: ["new zealand", "transverse mercator", "nzgd2000"],
      type: "projected", category: "New Zealand", datum: "NZGD2000", projection: "Transverse Mercator", unit: "metres",
      area: { west: 166.37, south: -47.33, east: 178.63, north: -34.1 },
      xMin: 1000000, xMax: 2200000, yMin: 4500000, yMax: 6500000,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for New Zealand.",
      documentation: { region: "New Zealand", summary: "NZGD2000 / New Zealand Transverse Mercator 2000 is a Transverse Mercator coordinate reference system based on NZGD2000.", commonUses: "New Zealand national topographic and GIS data", limitations: "Intended for New Zealand." }
    },
    {
      key: "EPSG:4548", code: "EPSG:4548", epsg: "4548",
      name: "CGCS2000 / 3-degree Gauss-Kruger CM 117E", aliases: ["china, 117\u00b0e zone", "transverse mercator", "cgcs2000"],
      type: "projected", category: "China, 117\u00b0E zone", datum: "CGCS2000", projection: "Transverse Mercator", unit: "metres",
      area: { west: 115.5, south: 0, east: 118.5, north: 84 },
      xMin: 300000, xMax: 700000, yMin: 0, yMax: 10000000,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for China, 117\u00b0E zone.",
      documentation: { region: "China, 117\u00b0E zone", summary: "CGCS2000 / 3-degree Gauss-Kruger CM 117E is a Transverse Mercator coordinate reference system based on CGCS2000.", commonUses: "Chinese mapping within the 117\u00b0E central-meridian zone", limitations: "This is one zoned CRS, not a universal CRS for all of China." }
    },
    {
      key: "EPSG:5179", code: "EPSG:5179", epsg: "5179",
      name: "Korea 2000 / Unified CS", aliases: ["korean peninsula", "transverse mercator", "korea 2000"],
      type: "projected", category: "Korean Peninsula", datum: "Korea 2000", projection: "Transverse Mercator", unit: "metres",
      area: { west: 122.71, south: 28.6, east: 134.28, north: 40.27 },
      xMin: 500000, xMax: 1500000, yMin: 1200000, yMax: 2600000,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for Korean Peninsula.",
      documentation: { region: "Korean Peninsula", summary: "Korea 2000 / Unified CS is a Transverse Mercator coordinate reference system based on Korea 2000.", commonUses: "National and web-GIS datasets in South Korea", limitations: "Use within the defined Korean area of use." }
    },
    {
      key: "EPSG:6677", code: "EPSG:6677", epsg: "6677",
      name: "JGD2011 / Japan Plane Rectangular CS IX", aliases: ["japan, zone ix", "transverse mercator", "jgd2011"],
      type: "projected", category: "Japan, zone IX", datum: "JGD2011", projection: "Transverse Mercator", unit: "metres",
      area: { west: 138.4, south: 34.85, east: 141.11, north: 37.98 },
      xMin: -200000, xMax: 200000, yMin: -200000, yMax: 300000,
      xName: "Easting", yName: "Northing",
      help: "Expected projected coordinates in metres for Japan, zone IX.",
      documentation: { region: "Japan, zone IX", summary: "JGD2011 / Japan Plane Rectangular CS IX is a Transverse Mercator coordinate reference system based on JGD2011.", commonUses: "Central Japan, including the Tokyo region", limitations: "Japan has multiple plane rectangular zones; zone IX is not valid nationwide." }
    },
    {
      key: "UTM",
      code: "UTM",
      epsg: "",
      name: "WGS 84 / UTM",
      aliases: ["universal transverse mercator", "utm north", "utm south"],
      type: "utm",
      help: "Select a UTM zone from 1 to 60 and the northern or southern hemisphere.", category: "Global", datum: "WGS 84", projection: "Transverse Mercator", unit: "metres", documentation: { region: "Global between 80°S and 84°N", summary: "Universal Transverse Mercator divides the world into 60 six-degree longitude zones and uses separate northern and southern hemisphere coordinates.", commonUses: "GPS fieldwork, engineering, topographic mapping and regional GIS where a suitable zone is known.", limitations: "A zone and hemisphere are mandatory. Coordinates should not be used outside their proper zone, and standard UTM coverage excludes the polar caps." }
    }
  ];

  const CRS_RULES = Object.fromEntries(
    CRS_CATALOG
      .filter((item) => item.key !== "UTM")
      .map((item) => [item.key, item])
  );

  function catalogLabel(item) {
    return item.key === "UTM"
      ? "UTM — choose zone and hemisphere"
      : `${item.name} — ${item.code}`;
  }

  function searchCatalog(query) {
    const normalized = String(query || "").trim().toLowerCase();
    if (!normalized) return CRS_CATALOG;

    const tokens = normalized.split(/\s+/).filter(Boolean);

    return CRS_CATALOG
      .map((item) => {
        const text = [
          item.key, item.code, item.epsg, item.name,
          ...(item.aliases || [])
        ].join(" ").toLowerCase();

        const matched = tokens.every((token) => text.includes(token));
        let score = 0;

        if (item.epsg === normalized || item.key.toLowerCase() === normalized) score += 100;
        if (item.name.toLowerCase().startsWith(normalized)) score += 40;
        if (text.includes(normalized)) score += 20;

        return { item, matched, score };
      })
      .filter((entry) => entry.matched)
      .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
      .map((entry) => entry.item);
  }

  function mountCrsControls(containerId, prefix) {
    const container = $(containerId);
    const fragment = $("crs-controls-template").content.cloneNode(true);
    container.appendChild(fragment);

    const q = (role) => container.querySelector(`[data-role="${role}"]`);
    const controls = {
      prefix,
      sourceSearch: q("source-search"),
      targetSearch: q("target-search"),
      sourceSearchResults: q("source-search-results"),
      targetSearchResults: q("target-search-results"),
      sourceCrs: q("source-crs"),
      targetCrs: q("target-crs"),
      sourceUtmOptions: q("source-utm-options"),
      targetUtmOptions: q("target-utm-options"),
      sourceZone: q("source-zone"),
      targetZone: q("target-zone"),
      sourceHemisphere: q("source-hemisphere"),
      targetHemisphere: q("target-hemisphere"),
      autoTargetUtm: q("auto-target-utm"),
      sourceZoneHelp: q("source-zone-help"),
      targetZoneHelp: q("target-zone-help"),
      sourceRangeHelp: q("source-range-help"),
      swap: q("swap")
    };

    populateCrsSelect(controls.sourceCrs, "EPSG:4326");
    populateCrsSelect(controls.targetCrs, "EPSG:2039");
    fillZones(controls.sourceZone, 36);
    fillZones(controls.targetZone, 36);
    initialiseCrsSearch(controls, "source");
    initialiseCrsSearch(controls, "target");

    [
      controls.sourceCrs, controls.targetCrs,
      controls.sourceZone, controls.targetZone,
      controls.sourceHemisphere, controls.targetHemisphere,
      controls.autoTargetUtm
    ].forEach((element) => {
      element.addEventListener("change", () => {
        updateCrsControls(controls);
        if (prefix === "single") updateSingleInputLabels();
      });
    });

    controls.swap.addEventListener("click", () => {
      const oldCrs = controls.sourceCrs.value;
      controls.sourceCrs.value = controls.targetCrs.value;
      controls.targetCrs.value = oldCrs;

      const oldZone = controls.sourceZone.value;
      controls.sourceZone.value = controls.targetZone.value;
      controls.targetZone.value = oldZone;

      const oldHemisphere = controls.sourceHemisphere.value;
      controls.sourceHemisphere.value = controls.targetHemisphere.value;
      controls.targetHemisphere.value = oldHemisphere;

      controls.sourceCrs.dispatchEvent(new Event("change", { bubbles: true }));
      controls.targetCrs.dispatchEvent(new Event("change", { bubbles: true }));
      updateCrsControls(controls);
      if (prefix === "single") updateSingleInputLabels();
    });

    updateCrsControls(controls);
    return controls;
  }

  function populateCrsSelect(select, selectedKey) {
    select.innerHTML = "";
    CRS_CATALOG.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.key;
      option.textContent = catalogLabel(item);
      option.selected = item.key === selectedKey;
      select.appendChild(option);
    });
  }

  function initialiseCrsSearch(controls, side) {
    const input = side === "source" ? controls.sourceSearch : controls.targetSearch;
    const results = side === "source"
      ? controls.sourceSearchResults
      : controls.targetSearchResults;
    const select = side === "source" ? controls.sourceCrs : controls.targetCrs;

    function closeResults() {
      results.classList.add("is-hidden");
      results.replaceChildren();
    }

    function choose(item) {
      select.value = item.key;
      input.value = item.key === "UTM" ? "UTM" : `${item.code} — ${item.name}`;
      closeResults();
      updateCrsControls(controls);
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function render() {
      const matches = searchCatalog(input.value).slice(0, 12);
      results.replaceChildren();

      if (!input.value.trim()) {
        closeResults();
        return;
      }

      if (!matches.length) {
        const empty = document.createElement("div");
        empty.className = "crs-result-button";
        empty.textContent = "No supported CRS matches this search.";
        results.appendChild(empty);
        results.classList.remove("is-hidden");
        return;
      }

      matches.forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "crs-result-button";
        button.setAttribute("role", "option");

        const code = document.createElement("span");
        code.className = "crs-result-code";
        code.textContent = item.key === "UTM" ? "UTM" : item.code;

        const name = document.createTextNode(item.name);

        const meta = document.createElement("span");
        meta.className = "crs-result-meta";
        meta.textContent = item.key === "UTM"
          ? "Zones 1–60; northern or southern hemisphere"
          : item.aliases.slice(0, 3).join(" · ");

        button.append(code, name, meta);
        button.addEventListener("click", () => choose(item));
        results.appendChild(button);
      });

      results.classList.remove("is-hidden");
    }

    input.addEventListener("input", render);
    input.addEventListener("focus", render);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeResults();
      if (event.key === "Enter") {
        const match = searchCatalog(input.value)[0];
        if (match) {
          event.preventDefault();
          choose(match);
        }
      }
    });

    select.addEventListener("change", () => {
      const item = CRS_CATALOG.find((entry) => entry.key === select.value);
      input.value = item && item.key !== "UTM"
        ? `${item.code} — ${item.name}`
        : item ? "UTM" : "";
    });

    document.addEventListener("click", (event) => {
      if (!results.contains(event.target) && event.target !== input) closeResults();
    });

    const initial = CRS_CATALOG.find((item) => item.key === select.value);
    input.value = initial && initial.key !== "UTM"
      ? `${initial.code} — ${initial.name}`
      : initial ? "UTM" : "";
  }

  function fillZones(select, selectedZone) {
    select.innerHTML = "";
    for (let zone = 1; zone <= 60; zone += 1) {
      const option = document.createElement("option");
      option.value = String(zone);
      option.textContent = String(zone);
      option.selected = zone === selectedZone;
      select.appendChild(option);
    }
  }

  function updateCrsControls(controls) {
    const sourceIsUtm = controls.sourceCrs.value === "UTM";
    const targetIsUtm = controls.targetCrs.value === "UTM";
    controls.sourceUtmOptions.classList.toggle("is-hidden", !sourceIsUtm);
    controls.targetUtmOptions.classList.toggle("is-hidden", !targetIsUtm);
    updateZoneHelp(controls.sourceZoneHelp, Number(controls.sourceZone.value));
    updateZoneHelp(controls.targetZoneHelp, Number(controls.targetZone.value));

    controls.sourceRangeHelp.textContent = sourceIsUtm
      ? "Expected: Easting approximately 100,000–900,000 m; Northing 0–10,000,000 m."
      : CRS_RULES[controls.sourceCrs.value].help;
  }

  function updateZoneHelp(element, zone) {
    const west = -180 + (zone - 1) * 6;
    element.textContent = `Standard zone ${zone}: ${west}° to ${west + 6}° longitude.`;
  }

  function parseCoordinate(rawValue) {
    if (typeof rawValue === "number") {
      if (!Number.isFinite(rawValue)) throw new Error("Coordinate is not a finite number.");
      return rawValue;
    }
    if (rawValue === null || rawValue === undefined || String(rawValue).trim() === "") {
      throw new Error("A coordinate value is missing.");
    }
    const cleaned = String(rawValue).trim().replace(/\s+/g, "").replace(",", ".");
    const value = Number(cleaned);
    if (!Number.isFinite(value)) throw new Error(`"${rawValue}" is not a valid number.`);
    return value;
  }

  function within(value, min, max, tolerance = 0) {
    return value >= min - tolerance && value <= max + tolerance;
  }

  function normaliseLongitude(longitude) {
    if (longitude === 180) return 180;
    return ((longitude + 180) % 360 + 360) % 360 - 180;
  }

  function standardUtmZone(longitude) {
    const lon = normaliseLongitude(longitude);
    if (lon === 180) return 60;
    return Math.floor((lon + 180) / 6) + 1;
  }

  function utmZoneForLocation(longitude, latitude) {
    const lon = normaliseLongitude(longitude);
    if (latitude >= 56 && latitude < 64 && lon >= 3 && lon < 12) return 32;
    if (latitude >= 72 && latitude < 84) {
      if (lon >= 0 && lon < 9) return 31;
      if (lon >= 9 && lon < 21) return 33;
      if (lon >= 21 && lon < 33) return 35;
      if (lon >= 33 && lon < 42) return 37;
    }
    return standardUtmZone(lon);
  }

  function hemisphereForLatitude(latitude) {
    return latitude >= 0 ? "N" : "S";
  }

  function createUtmDefinition(zone, hemisphere) {
    const code = `CUSTOM:UTM${zone}${hemisphere}`;
    const southFlag = hemisphere === "S" ? " +south" : "";
    proj4.defs(
      code,
      `+proj=utm +zone=${zone}${southFlag} +datum=WGS84 +units=m +no_defs +type=crs`
    );
    return code;
  }

  function resolveCrs(controls, side, geographicLocation = null) {
    const sourceSide = side === "source";
    const selected = sourceSide ? controls.sourceCrs.value : controls.targetCrs.value;

    if (selected !== "UTM") {
      return {
        key: selected,
        code: selected,
        type: CRS_RULES[selected].type,
        label: catalogLabel(CRS_RULES[selected])
      };
    }

    let zone = Number(sourceSide ? controls.sourceZone.value : controls.targetZone.value);
    let hemisphere = sourceSide
      ? controls.sourceHemisphere.value
      : controls.targetHemisphere.value;

    if (
      !sourceSide &&
      controls.autoTargetUtm.checked &&
      geographicLocation
    ) {
      zone = utmZoneForLocation(geographicLocation[0], geographicLocation[1]);
      hemisphere = hemisphereForLatitude(geographicLocation[1]);
    }

    if (!Number.isInteger(zone) || zone < 1 || zone > 60) {
      throw new Error("UTM zone must be a whole number from 1 to 60.");
    }

    return {
      key: "UTM",
      code: createUtmDefinition(zone, hemisphere),
      type: "projected",
      zone,
      hemisphere,
      label: `WGS 84 / UTM zone ${zone}${hemisphere}`
    };
  }

  function isWithinArea(longitude, latitude, area, tolerance = 0.02) {
    return (
      within(longitude, area.west, area.east, tolerance) &&
      within(latitude, area.south, area.north, tolerance)
    );
  }

  function validateGeographic(longitude, latitude) {
    if (!within(longitude, -180, 180)) throw new Error("Longitude must be between −180° and 180°.");
    if (!within(latitude, -90, 90)) throw new Error("Latitude must be between −90° and 90°.");
  }

  function validateProjectedInput(x, y, crsKey) {
    const rule = CRS_RULES[crsKey];
    if (within(x, rule.xMin, rule.xMax) && within(y, rule.yMin, rule.yMax)) return;

    if (within(y, rule.xMin, rule.xMax) && within(x, rule.yMin, rule.yMax)) {
      throw new Error(`${rule.label}: values appear reversed; enter Easting first and Northing second.`);
    }

    throw new Error(
      `${rule.label}: coordinate outside expected bounds ` +
      `(Easting ${Math.round(rule.xMin).toLocaleString()}–${Math.round(rule.xMax).toLocaleString()}, ` +
      `Northing ${Math.round(rule.yMin).toLocaleString()}–${Math.round(rule.yMax).toLocaleString()}).`
    );
  }

  function validateUtmNumeric(easting, northing) {
    if (within(easting, 100000, 900000) && within(northing, 0, 10000000)) return;
    if (within(northing, 100000, 900000) && within(easting, 0, 10000000)) {
      throw new Error("UTM values may be reversed; enter Easting first and Northing second.");
    }
    throw new Error("Implausible UTM coordinate; expected Easting 100,000–900,000 m and Northing 0–10,000,000 m.");
  }

  function validateSourceInput(source, x, y) {
    if (source.type === "geographic") validateGeographic(x, y);
    else if (source.key === "UTM") validateUtmNumeric(x, y);
    else validateProjectedInput(x, y, source.key);
  }

  function toGeographic(source, x, y) {
    if (source.type === "geographic") return [x, y];
    const result = proj4(source.code, "EPSG:4326", [x, y]);
    if (!result || !Number.isFinite(result[0]) || !Number.isFinite(result[1])) {
      throw new Error("Input could not be resolved to a valid geographic location.");
    }
    validateGeographic(result[0], result[1]);
    return result;
  }

  function validateSourceArea(source, longitude, latitude) {
    if (source.key !== "UTM" && source.key !== "EPSG:4326") {
      const rule = CRS_RULES[source.key];
      if (rule.area && !isWithinArea(longitude, latitude, rule.area)) {
        throw new Error(`${rule.name}: coordinate resolves outside its EPSG area of use.`);
      }
    }

    if (source.key === "UTM") {
      if (latitude < -80 || latitude > 84) throw new Error("UTM is normally used only between 80°S and 84°N.");
      const expectedZone = utmZoneForLocation(longitude, latitude);
      const expectedHemisphere = hemisphereForLatitude(latitude);
      if (source.zone !== expectedZone || source.hemisphere !== expectedHemisphere) {
        throw new Error(
          `Source UTM coordinate resolves to zone ${expectedZone}${expectedHemisphere}, ` +
          `not declared zone ${source.zone}${source.hemisphere}.`
        );
      }
    }
  }

  function validateTargetArea(target, longitude, latitude) {
    if (target.key !== "UTM" && target.key !== "EPSG:4326") {
      const rule = CRS_RULES[target.key];
      if (rule.area && !isWithinArea(longitude, latitude, rule.area)) {
        throw new Error(`${rule.name}: location is outside its EPSG area of use.`);
      }
    }
    if (target.key === "UTM" && (latitude < -80 || latitude > 84)) {
      throw new Error("UTM is normally used only between 80°S and 84°N.");
    }
  }

  function validateManualTargetUtm(controls, target, longitude, latitude) {
    if (target.key !== "UTM" || controls.autoTargetUtm.checked) return;
    const expectedZone = utmZoneForLocation(longitude, latitude);
    const expectedHemisphere = hemisphereForLatitude(latitude);
    if (target.zone !== expectedZone || target.hemisphere !== expectedHemisphere) {
      throw new Error(
        `Location belongs to UTM zone ${expectedZone}${expectedHemisphere}, ` +
        `not ${target.zone}${target.hemisphere}.`
      );
    }
  }

  function validateRoundTrip(source, target, input, output) {
    const returned = proj4(target.code, source.code, output);
    const tolerance = source.type === "geographic" ? 1e-7 : 0.05;
    if (
      !returned ||
      !Number.isFinite(returned[0]) ||
      !Number.isFinite(returned[1]) ||
      Math.abs(returned[0] - input[0]) > tolerance ||
      Math.abs(returned[1] - input[1]) > tolerance
    ) {
      throw new Error("Transformation failed its round-trip consistency check.");
    }
  }

  function convertCoordinate(controls, rawX, rawY) {
    const x = parseCoordinate(rawX);
    const y = parseCoordinate(rawY);
    const source = resolveCrs(controls, "source");
    validateSourceInput(source, x, y);

    const geographic = toGeographic(source, x, y);
    validateSourceArea(source, geographic[0], geographic[1]);

    const target = resolveCrs(controls, "target", geographic);
    validateTargetArea(target, geographic[0], geographic[1]);
    validateManualTargetUtm(controls, target, geographic[0], geographic[1]);

    if (source.code === target.code) throw new Error("Source and target coordinate systems are identical.");

    const converted = proj4(source.code, target.code, [x, y]);
    if (!converted || !Number.isFinite(converted[0]) || !Number.isFinite(converted[1])) {
      throw new Error("Transformation did not return a valid coordinate.");
    }

    if (target.key === "UTM") {
      validateUtmNumeric(converted[0], converted[1]);
    } else if (target.key !== "EPSG:4326") {
      validateProjectedInput(converted[0], converted[1], target.key);
    }

    validateRoundTrip(source, target, [x, y], converted);

    return {
      x: converted[0],
      y: converted[1],
      sourceLabel: source.label,
      targetLabel: target.label,
      targetZone: target.key === "UTM" ? target.zone : "",
      targetHemisphere: target.key === "UTM" ? target.hemisphere : "",
      targetGeographic: target.type === "geographic",
      longitude: geographic[0],
      latitude: geographic[1]
    };
  }


  const osmAttribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  function addBaseLayer(map) {
    return L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: osmAttribution
    }).addTo(map);
  }

  const NOMINATIM_REVERSE_ENDPOINT =
    "https://nominatim.openstreetmap.org/reverse";
  const GEOCODE_CACHE_KEY = "coordinate-converter-v2.5-place-cache";
  const GEOCODE_MIN_INTERVAL_MS = 1100;
  let lastGeocodeRequestTime = 0;
  let geocodeQueue = Promise.resolve();
  let latestSingleGeographic = null;
  let lastCursorCoordinate = null;
  let currentCursorFormatted = null;

  function loadGeocodeCache() {
    try {
      const parsed = JSON.parse(localStorage.getItem(GEOCODE_CACHE_KEY) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  const geocodeCache = loadGeocodeCache();

  function saveGeocodeCache() {
    try {
      const entries = Object.entries(geocodeCache).slice(-250);
      localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(Object.fromEntries(entries)));
    } catch (_) {
      // Cache failure must not prevent an explicit lookup.
    }
  }

  function geocodeCacheKey(longitude, latitude) {
    return `${latitude.toFixed(5)},${longitude.toFixed(5)}`;
  }

  function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  function queueReverseGeocode(longitude, latitude) {
    const task = async () => {
      const key = geocodeCacheKey(longitude, latitude);
      if (geocodeCache[key]) return geocodeCache[key];

      const elapsed = Date.now() - lastGeocodeRequestTime;
      if (elapsed < GEOCODE_MIN_INTERVAL_MS) {
        await wait(GEOCODE_MIN_INTERVAL_MS - elapsed);
      }

      const url = new URL(NOMINATIM_REVERSE_ENDPOINT);
      url.searchParams.set("format", "geocodejson");
      url.searchParams.set("lat", String(latitude));
      url.searchParams.set("lon", String(longitude));
      url.searchParams.set("zoom", "18");
      url.searchParams.set("addressdetails", "1");
      url.searchParams.set("accept-language", navigator.language || "en");

      lastGeocodeRequestTime = Date.now();

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { "Accept": "application/geocode+json, application/json" },
        referrerPolicy: "strict-origin-when-cross-origin"
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("The place-name service is temporarily rate-limited. Please wait and try again.");
        }
        throw new Error(`Place lookup failed with HTTP ${response.status}.`);
      }

      const data = await response.json();
      const feature = data && data.features && data.features[0];

      if (!feature) {
        throw new Error("No mapped place or address was found near this coordinate.");
      }

      const geocoding = feature.properties && feature.properties.geocoding
        ? feature.properties.geocoding
        : {};

      const result = {
        label:
          geocoding.label ||
          geocoding.name ||
          "Nearest mapped location",
        name: geocoding.name || "",
        street: geocoding.street || "",
        housenumber: geocoding.housenumber || "",
        district:
          geocoding.district ||
          geocoding.locality ||
          geocoding.suburb ||
          "",
        city:
          geocoding.city ||
          geocoding.town ||
          geocoding.village ||
          geocoding.municipality ||
          "",
        county: geocoding.county || "",
        state: geocoding.state || "",
        postcode: geocoding.postcode || "",
        country: geocoding.country || "",
        countryCode: (geocoding.country_code || "").toUpperCase()
      };

      geocodeCache[key] = result;
      saveGeocodeCache();
      return result;
    };

    geocodeQueue = geocodeQueue.then(task, task);
    return geocodeQueue;
  }

  function renderPlaceResult(containerId, nameId, detailsId, place) {
    const container = $(containerId);
    const name = $(nameId);
    const details = $(detailsId);

    name.textContent = place.label;
    details.replaceChildren();

    const fields = [
      ["Name", place.name],
      ["Street", [place.street, place.housenumber].filter(Boolean).join(" ")],
      ["District", place.district],
      ["City / locality", place.city],
      ["County", place.county],
      ["State / region", place.state],
      ["Postcode", place.postcode],
      ["Country", [place.country, place.countryCode].filter(Boolean).join(" — ")]
    ];

    fields.forEach(([label, value]) => {
      if (!value) return;
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      row.append(dt, dd);
      details.appendChild(row);
    });

    container.classList.remove("is-hidden");
  }

  async function lookupAndDisplayPlace(longitude, latitude, target) {
    const button = target === "single"
      ? $("lookup-result-place")
      : $("lookup-map-place");
    const messageElement = target === "single"
      ? $("single-message")
      : $("map-coordinate-readout");

    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = "Looking up place…";

    try {
      const place = await queueReverseGeocode(longitude, latitude);

      if (target === "single") {
        renderPlaceResult(
          "single-place-result",
          "single-place-name",
          "single-place-details",
          place
        );
        showMessage(
          $("single-message"),
          "The nearest mapped place was found.",
          "success"
        );
      } else {
        renderPlaceResult(
          "map-place-result",
          "map-place-name",
          "map-place-details",
          place
        );
        $("map-coordinate-readout").textContent =
          `Selected WGS 84: ${longitude.toFixed(7)}, ${latitude.toFixed(7)} — ${place.label}`;

        if (singleMapMarker) {
          singleMapMarker
            .bindPopup(
              coordinatePopup(longitude, latitude, "Selected location") +
              `<div class="coordinate-popup">${escapeHtml(place.label)}</div>`
            )
            .openPopup();
        }
      }
    } catch (error) {
      if (target === "single") {
        showMessage(
          $("single-message"),
          error.message || "Place lookup failed.",
          "error"
        );
      } else {
        $("map-coordinate-readout").textContent =
          error.message || "Place lookup failed.";
      }
    } finally {
      button.textContent = originalText;
      button.disabled = target === "single"
        ? !latestSingleGeographic
        : !selectedMapPoint;
    }
  }

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = String(value || "");
    return div.innerHTML;
  }

  const singleMap = L.map("single-map", {
    center: [31.8, 35.0],
    zoom: 7,
    zoomControl: true
  });
  addBaseLayer(singleMap);

  let singleMapMarker = null;
  let selectedMapPoint = null;

  function coordinatePopup(longitude, latitude, title) {
    return (
      '<div class="coordinate-popup"><strong>' + title + '</strong><br>' +
      'Longitude: ' + longitude.toFixed(7) + '<br>' +
      'Latitude: ' + latitude.toFixed(7) + '</div>'
    );
  }

  function setSingleMapPoint(longitude, latitude, options = {}) {
    if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return;

    selectedMapPoint = { longitude, latitude };

    if (!singleMapMarker) {
      singleMapMarker = L.marker([latitude, longitude]).addTo(singleMap);
    } else {
      singleMapMarker.setLatLng([latitude, longitude]);
    }

    singleMapMarker
      .bindPopup(coordinatePopup(longitude, latitude, options.title || "Selected location"))
      .openPopup();

    if (options.zoom !== false) {
      singleMap.setView([latitude, longitude], Math.max(singleMap.getZoom(), 12));
    }

    $("map-coordinate-readout").textContent =
      `Selected WGS 84: ${longitude.toFixed(7)}, ${latitude.toFixed(7)}`;
    $("use-map-point").disabled = false;
    $("lookup-map-place").disabled = false;
    $("clear-map-point").disabled = false;
    $("map-place-result").classList.add("is-hidden");
  }

  function clearSingleMapPoint() {
    if (singleMapMarker) {
      singleMap.removeLayer(singleMapMarker);
      singleMapMarker = null;
    }
    selectedMapPoint = null;
    $("map-coordinate-readout").textContent =
      "Click anywhere on the map to select a location.";
    $("use-map-point").disabled = true;
    $("lookup-map-place").disabled = true;
    $("clear-map-point").disabled = true;
    $("map-place-result").classList.add("is-hidden");
  }

  singleMap.on("click", (event) => {
    setSingleMapPoint(event.latlng.lng, event.latlng.lat, {
      title: "Map-selected location",
      zoom: false
    });
  });

  let cursorFramePending = false;
  let lastCursorLatLng = null;

  function formatCursorCoordinate(longitude, latitude, selection) {
    if (selection === "EPSG:4326") {
      return {
        label: "WGS 84 — Longitude, Latitude",
        value: `${longitude.toFixed(7)}, ${latitude.toFixed(7)}`
      };
    }

    if (selection === "AUTO_UTM") {
      if (latitude < -80 || latitude > 84) {
        return {
          label: "Automatic UTM",
          value: "Outside normal UTM latitude coverage"
        };
      }
      const zone = utmZoneForLocation(longitude, latitude);
      const hemisphere = hemisphereForLatitude(latitude);
      const code = createUtmDefinition(zone, hemisphere);
      const value = proj4("EPSG:4326", code, [longitude, latitude]);
      return {
        label: `WGS 84 / UTM zone ${zone}${hemisphere}`,
        value: `${value[0].toFixed(2)}, ${value[1].toFixed(2)}`
      };
    }

    let selectedCode = selection;
    let selectedLabel = selection;

    if (selection === "SOURCE") {
      try {
        const source = resolveCrs(singleControls, "source");
        selectedCode = source.code;
        selectedLabel = source.label;
      } catch (_) {
        return { label: "Current source CRS", value: "Source CRS is incomplete" };
      }
    } else if (selection === "TARGET") {
      try {
        const target = resolveCrs(singleControls, "target", [longitude, latitude]);
        selectedCode = target.code;
        selectedLabel = target.label;
      } catch (_) {
        return { label: "Current target CRS", value: "Target CRS is incomplete" };
      }
    } else {
      const rule = CRS_RULES[selection];
      selectedLabel = rule ? catalogLabel(rule) : selection;
    }

    if (
      (selection === "EPSG:2039" || selection === "EPSG:28193") &&
      !isWithinArea(longitude, latitude, ISRAEL_AREA)
    ) {
      return {
        label: selectedLabel,
        value: "Outside CRS area of use"
      };
    }

    const value = proj4("EPSG:4326", selectedCode, [longitude, latitude]);
    const geographic = selectedCode === "EPSG:4326";

    return {
      label: selectedLabel,
      value: geographic
        ? `${value[0].toFixed(7)}, ${value[1].toFixed(7)}`
        : `${value[0].toFixed(2)}, ${value[1].toFixed(2)}`
    };
  }

  function updatePrimaryCursorCoordinate() {
    if (!lastCursorCoordinate) {
      $("cursor-primary-label").textContent = "WGS 84";
      $("cursor-primary-value").textContent = "Move the pointer over the map";
      $("copy-cursor-coordinate").disabled = true;
      currentCursorFormatted = null;
      return;
    }

    const formatted = formatCursorCoordinate(
      lastCursorCoordinate.longitude,
      lastCursorCoordinate.latitude,
      $("cursor-display-crs").value
    );

    $("cursor-primary-label").textContent = formatted.label;
    $("cursor-primary-value").textContent = formatted.value;
    currentCursorFormatted = formatted;
    $("copy-cursor-coordinate").disabled =
      !formatted.value || formatted.value.includes("Outside") || formatted.value.includes("incomplete");
  }

  function updateCursorCoordinates(longitude, latitude) {
    lastCursorCoordinate = { longitude, latitude };

    $("cursor-wgs84").textContent =
      `${longitude.toFixed(7)}, ${latitude.toFixed(7)}`;

    if (latitude >= -80 && latitude <= 84) {
      const zone = utmZoneForLocation(longitude, latitude);
      const hemisphere = hemisphereForLatitude(latitude);
      const utmCode = createUtmDefinition(zone, hemisphere);
      const utm = proj4("EPSG:4326", utmCode, [longitude, latitude]);
      $("cursor-utm").textContent =
        `${zone}${hemisphere}: ${utm[0].toFixed(2)}, ${utm[1].toFixed(2)}`;
    } else {
      $("cursor-utm").textContent = "Outside normal UTM latitude coverage";
    }

    if (isWithinArea(longitude, latitude, ISRAEL_AREA)) {
      const itm = proj4("EPSG:4326", "EPSG:2039", [longitude, latitude]);
      $("cursor-itm").textContent =
        `${itm[0].toFixed(2)}, ${itm[1].toFixed(2)}`;
    } else {
      $("cursor-itm").textContent = "Outside EPSG:2039 area of use";
    }

    updatePrimaryCursorCoordinate();
  }

  singleMap.on("mousemove", (event) => {
    lastCursorLatLng = event.latlng;
    if (cursorFramePending) return;

    cursorFramePending = true;
    requestAnimationFrame(() => {
      cursorFramePending = false;
      if (!lastCursorLatLng) return;
      updateCursorCoordinates(
        lastCursorLatLng.lng,
        lastCursorLatLng.lat
      );
    });
  });

  singleMap.on("mouseout", () => {
    lastCursorCoordinate = null;
    $("cursor-wgs84").textContent = "Move the pointer over the map";
    $("cursor-utm").textContent = "—";
    $("cursor-itm").textContent = "Outside area of use";
    updatePrimaryCursorCoordinate();
  });

  $("cursor-display-crs").addEventListener("change", updatePrimaryCursorCoordinate);

  $("copy-cursor-coordinate").addEventListener("click", async () => {
    if (!currentCursorFormatted) return;
    try {
      await navigator.clipboard.writeText(
        `${currentCursorFormatted.label}: ${currentCursorFormatted.value}`
      );
      $("copy-cursor-coordinate").textContent = "Copied";
      setTimeout(() => {
        $("copy-cursor-coordinate").textContent = "Copy selected format";
      }, 1200);
    } catch (_) {
      $("copy-cursor-coordinate").textContent = "Copy failed";
    }
  });

  $("use-map-point").addEventListener("click", () => {
    if (!selectedMapPoint) return;

    singleControls.sourceCrs.value = "EPSG:4326";
    singleControls.sourceCrs.dispatchEvent(new Event("change", { bubbles: true }));
    updateCrsControls(singleControls);
    updateSingleInputLabels();

    $("single-x").value = selectedMapPoint.longitude.toFixed(7);
    $("single-y").value = selectedMapPoint.latitude.toFixed(7);
    showMessage(
      $("single-message"),
      "The map location was copied to the WGS 84 input fields.",
      "success"
    );
  });

  $("clear-map-point").addEventListener("click", clearSingleMapPoint);

  $("lookup-map-place").addEventListener("click", () => {
    if (!selectedMapPoint) return;
    lookupAndDisplayPlace(
      selectedMapPoint.longitude,
      selectedMapPoint.latitude,
      "map"
    );
  });

  let batchMap = null;
  let batchPointLayer = null;

  function ensureBatchMap() {
    if (!batchMap) {
      batchMap = L.map("batch-map", {
        center: [31.8, 35.0],
        zoom: 7,
        preferCanvas: true
      });
      addBaseLayer(batchMap);
      batchPointLayer = L.layerGroup().addTo(batchMap);
    }
    setTimeout(() => batchMap.invalidateSize(), 0);
    return batchMap;
  }

  function renderBatchMap(points, totalSuccessful) {
    const section = $("batch-map-section");

    if (!points.length) {
      section.classList.add("is-hidden");
      return;
    }

    section.classList.remove("is-hidden");
    const map = ensureBatchMap();
    batchPointLayer.clearLayers();

    const bounds = [];
    points.forEach((point) => {
      const latlng = [point.latitude, point.longitude];
      bounds.push(latlng);
      L.circleMarker(latlng, {
        radius: 4,
        weight: 1,
        fillOpacity: 0.7
      })
        .bindPopup(coordinatePopup(point.longitude, point.latitude, `Row ${point.row}`))
        .addTo(batchPointLayer);
    });

    if (bounds.length === 1) {
      map.setView(bounds[0], 12);
    } else {
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 13 });
    }

    const shown = points.length;
    $("batch-map-note").textContent =
      shown < totalSuccessful
        ? `Showing a representative sample of ${shown.toLocaleString()} of ${totalSuccessful.toLocaleString()} converted points.`
        : `Showing all ${shown.toLocaleString()} converted points.`;

    setTimeout(() => map.invalidateSize(), 30);
  }

  const singleControls = mountCrsControls("single-crs-controls", "single");
  const batchControls = mountCrsControls("batch-crs-controls", "batch");

  function updateSingleInputLabels() {
    const geographic = CRS_RULES[singleControls.sourceCrs.value]?.type === "geographic";
    $("single-x-label").textContent = geographic ? "Longitude / X" : "Easting / X";
    $("single-y-label").textContent = geographic ? "Latitude / Y" : "Northing / Y";
    if (geographic) {
      $("single-x").placeholder = "35.2";
      $("single-y").placeholder = "32.5";
    } else if (singleControls.sourceCrs.value === "EPSG:3857") {
      $("single-x").placeholder = "3910000";
      $("single-y").placeholder = "3820000";
    } else if (singleControls.sourceCrs.value === "EPSG:27700") {
      $("single-x").placeholder = "530000";
      $("single-y").placeholder = "180000";
    } else if (singleControls.sourceCrs.value === "EPSG:2154") {
      $("single-x").placeholder = "700000";
      $("single-y").placeholder = "6600000";
    } else {
      $("single-x").placeholder = "200000";
      $("single-y").placeholder = "650000";
    }
    $("single-result").classList.add("is-hidden");
    $("single-place-result").classList.add("is-hidden");
    latestSingleGeographic = null;
    $("lookup-result-place").disabled = true;
    showMessage($("single-message"), "");
  }

  function showMessage(element, text, type = "") {
    element.textContent = text;
    element.className = `message${type ? ` ${type}` : ""}`;
  }

  function buildShareableUrl() {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";

    url.searchParams.set("mode", "single");
    url.searchParams.set("x", $("single-x").value.trim());
    url.searchParams.set("y", $("single-y").value.trim());
    url.searchParams.set("source", singleControls.sourceCrs.value);
    url.searchParams.set("target", singleControls.targetCrs.value);

    if (singleControls.sourceCrs.value === "UTM") {
      url.searchParams.set("sourceZone", singleControls.sourceZone.value);
      url.searchParams.set("sourceHemisphere", singleControls.sourceHemisphere.value);
    }

    if (singleControls.targetCrs.value === "UTM") {
      url.searchParams.set("targetZone", singleControls.targetZone.value);
      url.searchParams.set("targetHemisphere", singleControls.targetHemisphere.value);
      url.searchParams.set(
        "autoTargetUtm",
        singleControls.autoTargetUtm.checked ? "1" : "0"
      );
    }

    if (latestSingleGeographic) {
      url.searchParams.set("lon", latestSingleGeographic.longitude.toFixed(7));
      url.searchParams.set("lat", latestSingleGeographic.latitude.toFixed(7));
    }

    return url.toString();
  }

  async function copyShareableLink() {
    try {
      await navigator.clipboard.writeText(buildShareableUrl());
      showMessage(
        $("single-message"),
        "A shareable conversion link was copied.",
        "success"
      );
    } catch (_) {
      showMessage(
        $("single-message"),
        "The shareable link could not be copied automatically.",
        "error"
      );
    }
  }

  function applySharedState() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") !== "single") return;

    const source = params.get("source");
    const target = params.get("target");
    const x = params.get("x");
    const y = params.get("y");

    if (!source || !target || x === null || y === null) return;

    const supportedKeys = new Set(CRS_CATALOG.map((item) => item.key));
    if (!supportedKeys.has(source) || !supportedKeys.has(target)) return;

    singleControls.sourceCrs.value = source;
    singleControls.targetCrs.value = target;

    if (source === "UTM") {
      const zone = Number(params.get("sourceZone"));
      if (Number.isInteger(zone) && zone >= 1 && zone <= 60) {
        singleControls.sourceZone.value = String(zone);
      }
      if (["N", "S"].includes(params.get("sourceHemisphere"))) {
        singleControls.sourceHemisphere.value = params.get("sourceHemisphere");
      }
    }

    if (target === "UTM") {
      const zone = Number(params.get("targetZone"));
      if (Number.isInteger(zone) && zone >= 1 && zone <= 60) {
        singleControls.targetZone.value = String(zone);
      }
      if (["N", "S"].includes(params.get("targetHemisphere"))) {
        singleControls.targetHemisphere.value = params.get("targetHemisphere");
      }
      singleControls.autoTargetUtm.checked =
        params.get("autoTargetUtm") !== "0";
    }

    singleControls.sourceCrs.dispatchEvent(new Event("change", { bubbles: true }));
    singleControls.targetCrs.dispatchEvent(new Event("change", { bubbles: true }));
    updateCrsControls(singleControls);
    updateSingleInputLabels();

    $("single-x").value = x;
    $("single-y").value = y;
    activateTab("single");

    setTimeout(() => $("single-convert").click(), 60);
  }

  $("share-conversion").addEventListener("click", copyShareableLink);

  $("single-convert").addEventListener("click", () => {
    $("single-result").classList.add("is-hidden");
    showMessage($("single-message"), "");
    try {
      const output = convertCoordinate(singleControls, $("single-x").value, $("single-y").value);
      $("single-result-crs").textContent = output.targetLabel;
      $("single-result-x-label").textContent = output.targetGeographic ? "Longitude" : "Easting";
      $("single-result-y-label").textContent = output.targetGeographic ? "Latitude" : "Northing";
      $("single-result-x").textContent = output.targetGeographic ? output.x.toFixed(7) : output.x.toFixed(3);
      $("single-result-y").textContent = output.targetGeographic ? output.y.toFixed(7) : output.y.toFixed(3);
      $("single-result").classList.remove("is-hidden");
      latestSingleGeographic = {
        longitude: output.longitude,
        latitude: output.latitude
      };
      $("lookup-result-place").disabled = false;
      $("single-place-result").classList.add("is-hidden");
      setSingleMapPoint(output.longitude, output.latitude, {
        title: "Converted location"
      });
      showMessage($("single-message"), "The coordinate was converted, validated, and displayed on the map.", "success");
    } catch (error) {
      showMessage($("single-message"), error.message || "Conversion failed.", "error");
    }
  });

  $("single-copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(
        `${$("single-result-x").textContent}, ${$("single-result-y").textContent}`
      );
      showMessage($("single-message"), "The converted coordinate was copied.", "success");
    } catch (_) {
      showMessage($("single-message"), "Copying failed. Copy the values manually.", "error");
    }
  });

  $("lookup-result-place").disabled = true;
  $("lookup-result-place").addEventListener("click", () => {
    if (!latestSingleGeographic) return;
    lookupAndDisplayPlace(
      latestSingleGeographic.longitude,
      latestSingleGeographic.latitude,
      "single"
    );
  });

  [$("single-x"), $("single-y")].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") $("single-convert").click();
    });
  });
  updateSingleInputLabels();
  function renderSupportedCatalog() {
    const container = $("supported-crs-list");
    const fragment = document.createDocumentFragment();

    CRS_CATALOG.forEach((item) => {
      const card = document.createElement("div");
      card.className = "supported-crs-item";

      const title = document.createElement("strong");
      title.textContent = item.key === "UTM" ? "UTM" : item.code;

      const name = document.createElement("span");
      name.textContent = item.key === "UTM"
        ? "WGS 84 / UTM zones 1–60, north and south"
        : item.name;

      card.append(title, name);
      fragment.appendChild(card);
    });

    container.replaceChildren(fragment);
  }

  renderSupportedCatalog();

  function renderDocumentation() {
    const list = $("documentation-list");
    const search = $("documentation-search");
    const region = $("documentation-region");
    const details = $("documentation-details");
    const documented = CRS_CATALOG;
    const regions = [...new Set(documented.map((item) => item.documentation?.region || item.category || "Common"))].sort();
    regions.forEach((value) => {
      const option = document.createElement("option"); option.value = value; option.textContent = value; region.appendChild(option);
    });
    function show(item) {
      const d = item.documentation || {};
      details.innerHTML = `<div class="documentation-heading"><div><p class="eyebrow">${item.code}</p><h2>${item.name}</h2></div><button type="button" class="secondary compact" id="doc-use-source">Use as source CRS</button></div>
        <p>${d.summary || `${item.name} is a supported coordinate reference system.`}</p>
        <dl class="documentation-facts"><div><dt>CRS type</dt><dd>${item.type}</dd></div><div><dt>Datum</dt><dd>${item.datum || "See EPSG definition"}</dd></div><div><dt>Projection</dt><dd>${item.projection || (item.type === "geographic" ? "Geographic coordinates" : "See EPSG definition")}</dd></div><div><dt>Units</dt><dd>${item.unit || (item.type === "geographic" ? "degrees" : "metres")}</dd></div><div><dt>Area of use</dt><dd>${d.region || "Global / defined by EPSG"}</dd></div><div><dt>Application input order</dt><dd>${item.type === "geographic" ? "Longitude, then latitude" : "Easting (X), then northing (Y)"}</dd></div></dl>
        <section><h3>Common uses</h3><p>${d.commonUses || "Coordinate conversion and GIS data integration."}</p></section>
        <section><h3>Limitations and accuracy</h3><p>${d.limitations || "Use an authoritative national geodetic service for cadastral or survey-grade work."}</p></section>
        <section><h3>Expected input</h3><p>${item.help || "Enter numeric coordinates using the order shown above."}</p></section>`;
      $("doc-use-source").addEventListener("click", () => { singleControls.sourceCrs.value = item.key; singleControls.sourceCrs.dispatchEvent(new Event("change", {bubbles:true})); activateTab("single"); });
    }
    function renderList() {
      const q = search.value.trim().toLowerCase(); const r = region.value;
      const matches = documented.filter((item) => (!r || (item.documentation?.region || item.category || "Common") === r) && (!q || [item.code,item.name,item.datum,item.projection,item.documentation?.region,...(item.aliases||[])].join(" ").toLowerCase().includes(q)));
      list.replaceChildren(); matches.forEach((item) => { const b=document.createElement("button"); b.type="button"; b.className="documentation-card"; b.innerHTML=`<strong>${item.code}</strong><span>${item.name}</span><small>${item.documentation?.region || "Common"}</small>`; b.addEventListener("click",()=>show(item)); list.appendChild(b); });
      if (!matches.length) list.textContent="No documented CRS matches the current filters.";
    }
    search.addEventListener("input",renderList); region.addEventListener("change",renderList); renderList(); show(documented[0]);
  }
  renderDocumentation();

  applySharedState();

  function activateTab(mode) {
    const single = mode === "single", batch = mode === "batch", documentation = mode === "documentation";
    [["single",single],["batch",batch],["documentation",documentation]].forEach(([name,active]) => {
      $(`${name}-tab`).classList.toggle("is-active", active); $(`${name}-tab`).setAttribute("aria-selected", String(active)); $(`${name}-panel`).classList.toggle("is-hidden", !active);
    });
    setTimeout(() => { if (single) singleMap.invalidateSize(); if (batch && batchMap) batchMap.invalidateSize(); }, 30);
  }

  $("single-tab").addEventListener("click", () => activateTab("single"));
  $("batch-tab").addEventListener("click", () => activateTab("batch"));
  $("documentation-tab").addEventListener("click", () => activateTab("documentation"));

  let workbook = null;
  let sheetMatrix = [];
  let outputMatrix = null;
  let errorMatrix = null;
  let inputFileBaseName = "coordinates";

  function resetBatchAfterFile() {
    $("batch-setup").classList.add("is-hidden");
    $("batch-crs-section").classList.add("is-hidden");
    $("batch-preview-section").classList.add("is-hidden");
    $("batch-results").classList.add("is-hidden");
    showMessage($("batch-message"), "");
    outputMatrix = null;
    errorMatrix = null;
    $("batch-map-section").classList.add("is-hidden");
    if (batchPointLayer) batchPointLayer.clearLayers();
  }

  $("batch-file").addEventListener("change", async (event) => {
    resetBatchAfterFile();
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showMessage($("batch-message"), "The file is larger than 15 MB.", "error");
      return;
    }

    inputFileBaseName = file.name.replace(/\.[^.]+$/, "") || "coordinates";

    try {
      const data = await file.arrayBuffer();
      workbook = XLSX.read(data, { type: "array", cellDates: true, dense: true });
      if (!workbook.SheetNames.length) throw new Error("The file contains no worksheets.");

      $("batch-sheet").innerHTML = "";
      workbook.SheetNames.forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        $("batch-sheet").appendChild(option);
      });

      $("batch-setup").classList.remove("is-hidden");
      $("batch-crs-section").classList.remove("is-hidden");
      $("batch-preview-section").classList.remove("is-hidden");
      loadSelectedSheet();
    } catch (error) {
      showMessage($("batch-message"), error.message || "The spreadsheet could not be read.", "error");
    }
  });

  function loadSelectedSheet() {
    if (!workbook) return;
    const sheet = workbook.Sheets[$("batch-sheet").value];
    sheetMatrix = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      raw: true,
      defval: null,
      blankrows: false
    });

    populateColumnSelectors();
    renderPreview();
  }

  function makeHeaderLabel(value, index) {
    const text = value === null || value === undefined || String(value).trim() === ""
      ? `Column ${index + 1}`
      : String(value).trim();
    return `${text} [${columnLetter(index)}]`;
  }

  function columnLetter(index) {
    let value = index + 1;
    let letters = "";
    while (value > 0) {
      const remainder = (value - 1) % 26;
      letters = String.fromCharCode(65 + remainder) + letters;
      value = Math.floor((value - 1) / 26);
    }
    return letters;
  }

  function populateColumnSelectors() {
    const headerIndex = Number($("batch-header-row").value);
    const header = sheetMatrix[headerIndex] || [];
    const maxColumns = Math.max(header.length, ...sheetMatrix.slice(0, 20).map((row) => row.length), 0);

    [$("batch-x-column"), $("batch-y-column")].forEach((select) => {
      select.innerHTML = "";
      for (let index = 0; index < maxColumns; index += 1) {
        const option = document.createElement("option");
        option.value = String(index);
        option.textContent = makeHeaderLabel(header[index], index);
        select.appendChild(option);
      }
    });

    const lowerHeaders = header.map((value) => String(value ?? "").trim().toLowerCase());
    const xIndex = lowerHeaders.findIndex((value) =>
      ["x", "longitude", "lon", "long", "easting", "east"].includes(value)
    );
    const yIndex = lowerHeaders.findIndex((value) =>
      ["y", "latitude", "lat", "northing", "north"].includes(value)
    );

    $("batch-x-column").value = String(xIndex >= 0 ? xIndex : 0);
    $("batch-y-column").value = String(yIndex >= 0 ? yIndex : Math.min(1, Math.max(0, maxColumns - 1)));
  }

  function renderPreview() {
    const headerIndex = Number($("batch-header-row").value);
    const header = sheetMatrix[headerIndex] || [];
    const rows = sheetMatrix.slice(headerIndex + 1).filter((row) =>
      row.some((value) => value !== null && value !== undefined && String(value).trim() !== "")
    );

    const maxColumns = Math.min(
      Math.max(header.length, ...rows.slice(0, PREVIEW_ROWS).map((row) => row.length), 0),
      12
    );

    const headRow = document.createElement("tr");
    for (let index = 0; index < maxColumns; index += 1) {
      const th = document.createElement("th");
      th.textContent = makeHeaderLabel(header[index], index);
      headRow.appendChild(th);
    }
    $("batch-preview-table").querySelector("thead").replaceChildren(headRow);

    const body = document.createDocumentFragment();
    rows.slice(0, PREVIEW_ROWS).forEach((row) => {
      const tr = document.createElement("tr");
      for (let index = 0; index < maxColumns; index += 1) {
        const td = document.createElement("td");
        const value = row[index];
        td.textContent = value instanceof Date
          ? value.toISOString().slice(0, 10)
          : value === null || value === undefined ? "" : String(value);
        tr.appendChild(td);
      }
      body.appendChild(tr);
    });
    $("batch-preview-table").querySelector("tbody").replaceChildren(body);

    $("batch-summary").textContent =
      `${rows.length.toLocaleString()} data rows; showing the first ${Math.min(rows.length, PREVIEW_ROWS)}.`;

    if (rows.length > MAX_ROWS) {
      showMessage(
        $("batch-message"),
        `This worksheet has ${rows.length.toLocaleString()} rows. The current limit is ${MAX_ROWS.toLocaleString()}.`,
        "error"
      );
      $("batch-convert").disabled = true;
    } else {
      showMessage($("batch-message"), "");
      $("batch-convert").disabled = rows.length === 0;
    }
    $("batch-results").classList.add("is-hidden");
  }

  $("batch-sheet").addEventListener("change", loadSelectedSheet);
  $("batch-header-row").addEventListener("change", () => {
    populateColumnSelectors();
    renderPreview();
  });
  $("batch-x-column").addEventListener("change", () => $("batch-results").classList.add("is-hidden"));
  $("batch-y-column").addEventListener("change", () => $("batch-results").classList.add("is-hidden"));

  function uniqueHeader(existing, desired) {
    let name = desired;
    let counter = 2;
    const normalized = new Set(existing.map((value) => String(value ?? "").toLowerCase()));
    while (normalized.has(name.toLowerCase())) {
      name = `${desired}_${counter}`;
      counter += 1;
    }
    existing.push(name);
    return name;
  }

  function nextFrame() {
    return new Promise((resolve) => requestAnimationFrame(resolve));
  }

  $("batch-convert").addEventListener("click", async () => {
    $("batch-results").classList.add("is-hidden");
    showMessage($("batch-message"), "");

    const headerIndex = Number($("batch-header-row").value);
    const header = [...(sheetMatrix[headerIndex] || [])];
    const dataRows = sheetMatrix.slice(headerIndex + 1).filter((row) =>
      row.some((value) => value !== null && value !== undefined && String(value).trim() !== "")
    );

    if (!dataRows.length) {
      showMessage($("batch-message"), "No data rows were found.", "error");
      return;
    }
    if (dataRows.length > MAX_ROWS) {
      showMessage($("batch-message"), `The maximum is ${MAX_ROWS.toLocaleString()} rows.`, "error");
      return;
    }

    const xIndex = Number($("batch-x-column").value);
    const yIndex = Number($("batch-y-column").value);
    if (xIndex === yIndex) {
      showMessage($("batch-message"), "Select two different columns for X and Y.", "error");
      return;
    }

    const outputHeaders = [...header];
    const added = {
      x: uniqueHeader(outputHeaders, "Converted_X"),
      y: uniqueHeader(outputHeaders, "Converted_Y"),
      source: uniqueHeader(outputHeaders, "Source_CRS"),
      target: uniqueHeader(outputHeaders, "Target_CRS"),
      zone: uniqueHeader(outputHeaders, "Target_UTM_Zone"),
      hemisphere: uniqueHeader(outputHeaders, "Target_UTM_Hemisphere"),
      status: uniqueHeader(outputHeaders, "Conversion_Status"),
      message: uniqueHeader(outputHeaders, "Conversion_Message")
    };

    const outputRows = [outputHeaders];
    const errors = [[
      "Excel_Row", "Original_X", "Original_Y",
      "Source_CRS", "Target_CRS", "Error_Message"
    ]];

    let successCount = 0;
    let errorCount = 0;
    const batchMapPoints = [];
    const MAX_MAP_POINTS = 1000;

    $("batch-progress-wrap").classList.remove("is-hidden");
    $("batch-progress").value = 0;
    $("batch-convert").disabled = true;

    for (let index = 0; index < dataRows.length; index += 1) {
      const original = [...dataRows[index]];
      while (original.length < header.length) original.push(null);

      const resultCells = new Array(8).fill("");
      try {
        const conversion = convertCoordinate(batchControls, original[xIndex], original[yIndex]);
        resultCells[0] = conversion.targetGeographic ? conversion.x : Number(conversion.x.toFixed(3));
        resultCells[1] = conversion.targetGeographic ? conversion.y : Number(conversion.y.toFixed(3));
        resultCells[2] = conversion.sourceLabel;
        resultCells[3] = conversion.targetLabel;
        resultCells[4] = conversion.targetZone;
        resultCells[5] = conversion.targetHemisphere;
        resultCells[6] = "OK";
        resultCells[7] = "";
        successCount += 1;

        // Keep at most 1,000 points for an efficient browser map preview.
        if (batchMapPoints.length < MAX_MAP_POINTS) {
          batchMapPoints.push({
            longitude: conversion.longitude,
            latitude: conversion.latitude,
            row: headerIndex + index + 2
          });
        }
      } catch (error) {
        let sourceLabel = batchControls.sourceCrs.options[batchControls.sourceCrs.selectedIndex].text;
        let targetLabel = batchControls.targetCrs.options[batchControls.targetCrs.selectedIndex].text;
        resultCells[2] = sourceLabel;
        resultCells[3] = targetLabel;
        resultCells[6] = "ERROR";
        resultCells[7] = error.message || "Conversion failed.";
        errors.push([
          headerIndex + index + 2,
          original[xIndex],
          original[yIndex],
          sourceLabel,
          targetLabel,
          resultCells[7]
        ]);
        errorCount += 1;
      }

      outputRows.push(original.concat(resultCells));

      if (index % 200 === 0 || index === dataRows.length - 1) {
        const percent = Math.round(((index + 1) / dataRows.length) * 100);
        $("batch-progress").value = percent;
        $("batch-progress-text").textContent =
          `${percent}% — ${(index + 1).toLocaleString()} of ${dataRows.length.toLocaleString()}`;
        await nextFrame();
      }
    }

    outputMatrix = outputRows;
    errorMatrix = errors.length > 1 ? errors : null;

    $("batch-total").textContent = dataRows.length.toLocaleString();
    $("batch-success").textContent = successCount.toLocaleString();
    $("batch-errors").textContent = errorCount.toLocaleString();
    $("download-errors").classList.toggle("is-hidden", !errorMatrix);
    $("batch-results").classList.remove("is-hidden");
    renderBatchMap(batchMapPoints, successCount);
    $("batch-convert").disabled = false;

    showMessage(
      $("batch-message"),
      `Completed: ${successCount.toLocaleString()} converted, ${errorCount.toLocaleString()} errors.`,
      errorCount ? "error" : "success"
    );
  });

  function createWorkbookFromMatrix(matrix, sheetName) {
    const worksheet = XLSX.utils.aoa_to_sheet(matrix);
    worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

    const widths = matrix[0].map((header, index) => {
      let width = Math.max(10, String(header ?? "").length + 2);
      for (const row of matrix.slice(1, 101)) {
        const value = row[index];
        if (value !== null && value !== undefined) {
          width = Math.max(width, Math.min(35, String(value).length + 2));
        }
      }
      return { wch: Math.min(width, 35) };
    });
    worksheet["!cols"] = widths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, sheetName);
    return wb;
  }

  $("download-results").addEventListener("click", () => {
    if (!outputMatrix) return;
    const wb = createWorkbookFromMatrix(outputMatrix, "Converted Coordinates");
    XLSX.writeFile(wb, `${inputFileBaseName}_converted.xlsx`, {
      compression: true,
      bookType: "xlsx"
    });
  });

  $("download-errors").addEventListener("click", () => {
    if (!errorMatrix) return;
    const wb = createWorkbookFromMatrix(errorMatrix, "Conversion Errors");
    XLSX.writeFile(wb, `${inputFileBaseName}_errors.xlsx`, {
      compression: true,
      bookType: "xlsx"
    });
  });

  $("download-template").addEventListener("click", () => {
    const template = [
      ["ID", "X", "Y", "Name"],
      [1, 35.2, 32.5, "Example WGS 84 point"],
      [2, 34.7818, 32.0853, "Example WGS 84 point"]
    ];
    const wb = createWorkbookFromMatrix(template, "Coordinates");
    XLSX.writeFile(wb, "coordinate_conversion_template.xlsx", {
      compression: true,
      bookType: "xlsx"
    });
  });
});
