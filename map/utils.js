export const DEFAULT_LNG = 12.336;
export const DEFAULT_LAT = 45.4383;
export const DEFAULT_ZOOM = 14;
export const BOUNDS = [
  [12.308, 45.427],
  [12.363, 45.449],
];

const stretchBounds = (bounds, verticalStretch, horizontalStretch) => {
  return [
    [bounds[0][0] - verticalStretch, bounds[0][1] - horizontalStretch],
    [bounds[1][0] + verticalStretch, bounds[1][1] + horizontalStretch],
  ];
};

const H_W_RATIO = 2.318;
const UNZOOM_VERTICAL_STRETCH = 0.05;

export const MAX_BOUNDS = stretchBounds(
  BOUNDS,
  UNZOOM_VERTICAL_STRETCH * H_W_RATIO,
  UNZOOM_VERTICAL_STRETCH
);



export const parcel_fill_colors = [
  {type: "building", color: "#f399f7"},
  {type: "courtyard", color: "#f1dff2"},
  {type: "water", color: "#97e9f7"},
  {type: "street", color: "#fffee6"},
  {type: "sottoportico", color: "#ffe436"},
]

export const parcel_fill_colors_grayscale = [
  {type: "building", color: "#c7c7c7"},
  {type: "courtyard", color: "#e8e8e8"},
  {type: "water", color: "#97e9f7"},
  {type: "street", color: "#fffee6"},
  {type: "sottoportico", color: "#9c9c9c"},
]

export const getParcelFillColorPaintProperty = colors => [
  "match",
  ["get", "parcel_type"],
  ...colors.map(x=>[x.type, x.color]).reduce((a,b)=> [...a,...b], []),
  "#ffffff",
]
