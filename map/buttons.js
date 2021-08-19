import React, { forwardRef } from "react";
import { MdCenterFocusStrong } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { RiTreasureMapLine } from "react-icons/ri";

const RecenterIcon = MdCenterFocusStrong;
const ClearIcon = AiOutlineClose;
const RasterIcon = RiTreasureMapLine;

const BaseButton = forwardRef(
  ({ icon, className, label = "", onClick = () => {} }, ref) => (
    <button
      className={className}
      ref={ref}
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
    >
      {icon}
    </button>
  )
);

export const CenterButton = forwardRef(({ onClick = () => {} }, ref) => (
  <BaseButton
    className="map-button center-button"
    ref={ref}
    icon={<RecenterIcon />}
    label="Reset map to center"
    onClick={onClick}
  />
));

export const ClearBoundsButton = forwardRef(({ onClick = () => {} }, ref) => (
  <BaseButton
    className="map-button clear-button"
    ref={ref}
    icon={<ClearIcon />}
    label="Clear selection bounds"
    onClick={onClick}
  />
));

export const ShowRasterButton = forwardRef(({ onClick = () => {} }, ref) => (
  <BaseButton
    className="map-button raster-button"
    ref={ref}
    icon={<RasterIcon />}
    label="Show cadastral map sheets"
    onClick={onClick}
  />
));
