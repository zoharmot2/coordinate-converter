# Coordinate Converter v2.4.1

Version 2.4.1 is a usability and interface refinement release based on version 2.4.

## Text update

The introductory sentence now reads:

> Convert a single coordinate or an Excel/CSV file using a searchable local CRS
> catalog, including WGS 84, Israeli grids, UTM, Web Mercator, British National
> Grid & Lambert-93.

## Expanded introduction

A short explanation now tells users that the application can:

- Convert one coordinate.
- Process Excel and CSV files.
- Display converted points on a map.
- Copy coordinates in several CRS formats.
- Look up mapped place names.
- Create shareable conversion links.

An expandable “How to use the converter” section explains the single-point,
spreadsheet, and interactive-map workflows.

## CRS labels

The labels now read:

- Selected Source CRS
- Selected Target CRS

These changes apply to both:

- The Single coordinate tab.
- The Excel / CSV batch tab.

## Visual emphasis

The selected source and target CRS dropdowns now use:

- A stronger blue border.
- A pale blue background.
- Bold text.
- A more visible blue focus state.

## Workflow guidance

The single-coordinate tab now shows:

1. Step 1 — Select coordinate systems.
2. Step 2 — Enter coordinates.
3. Step 3 — Convert.

## GitHub Pages update

Upload these files to the repository root:

- index.html
- style-v2.4.1.css
- app-v2.4.1.js
- README.md

The WordPress iframe URL remains unchanged. To avoid cached content, use a
version query such as:

`?v=2.4.1`

After deployment, hard-refresh the page.
