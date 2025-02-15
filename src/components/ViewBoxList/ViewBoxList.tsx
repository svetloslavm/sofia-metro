import { FC } from "react";

import { MAP_STYLES } from "consts";
import { MapStyle } from "typings";

interface ViewBoxListProps {
  mapStyle: MapStyle;
  mapStyleOrder: MapStyle[];
  onStyleChange: (style: MapStyle) => void;
}

export const ViewBoxList: FC<ViewBoxListProps> = ({
  mapStyle,
  mapStyleOrder,
  onStyleChange,
}) => {
  const viewBoxStyles = (style: MapStyle) => ({
    display: mapStyle === style ? "flex" : "none",
    border: mapStyle === style ? `2px solid #646cff` : `2px solid transparent`,
  });

  return mapStyleOrder.map((style) => (
    <div
      key={style}
      id={style}
      className="viewBox"
      onClick={() => onStyleChange(style)}
      style={viewBoxStyles(style)}
    >
      {MAP_STYLES[style].image}
      <span>{MAP_STYLES[style].label}</span>
    </div>
  ));
};
