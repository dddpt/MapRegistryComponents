
import {
  MAP_GLYPHS_URL,
  MAP_RASTER_TILES_PATH,
  MAP_CADASTER_TILES_PATH,
} from "../config"

import {
  getParcelFillColorPaintProperty,
  parcel_fill_colors_grayscale
} from "../MapRegistryComponents/map/utils"

const mapStyle = {
  version: 8,
  glyphs: MAP_GLYPHS_URL,
  name: "Cadaster 1808",
  sources: {
    cadaster_raster: {
      type: "raster",
      // tiles: ["local://./geo/tiles/{z}/{x}/{y}.png"],
      tiles: [MAP_RASTER_TILES_PATH],
      tileSize: 256,
      scheme: "tms",
      minzoom: 12,
      maxzoom: 20,
      center: [12.335072, 45.438333, 20],
      bounds: [12.30909, 45.426934, 12.36185, 45.450465],
    },
    cadaster: {
      type: "vector",
      // tiles: ["local://./geo/public.cadaster_1808/{z}/{x}/{y}.pbf"],
      tiles: [MAP_CADASTER_TILES_PATH],

      minzoom: 0,
      maxzoom: 20,
      center: [12.335072, 45.438333, 20],
      bounds: [12.306506, 45.424157, 12.369838, 45.452203],
    },
    //...cadasterMapSources,
    //...catasticiMapSources
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: { "background-color": "#97e9f7" },
    },

    {
      id: "cadaster_raster",
      type: "raster",
      source: "cadaster_raster",
      minzoom: 0,
      maxzoom: 22,
      visibility: "none",
      paint: {
        "raster-opacity": 0,
      },
    },

    {
      id: "parcel_fill_grayscale",
      type: "fill",
      source: "cadaster",
      "source-layer": "public.cadaster_1808",
      paint: {
        "fill-color": getParcelFillColorPaintProperty(parcel_fill_colors_grayscale)
      }
    },
    //...cadasterMapLayers,
    {
      id: "cadaster_border",
      source: "cadaster",
      "source-layer": "public.cadaster_1808",
      type: "line",
      layout: {
        "line-join": "round",
      },
      filter: ["!=", ["get", "parcel_type"], "water"],
      paint: {
        "line-color": "#000000",
        "line-width": [
          "interpolate",
          ["exponential", 0.5],
          ["zoom"],
          15,
          0.1,
          22,
          0.4,
        ],
      },
    },
    //...catasticiMapLayers
  ],
};

export default mapStyle;
