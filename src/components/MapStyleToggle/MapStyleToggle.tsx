import { MAP_STYLES } from "consts";
import { MapStyle } from "typings";

interface MapStyleToggleProps {
  mapStyle: MapStyle;
  mapStyleOrder: Array<MapStyle>;
  onStyleChange: (style: MapStyle) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const MapStyleToggle = ({
  mapStyle,
  mapStyleOrder,
  onStyleChange,
  onMouseEnter,
  onMouseLeave,
}: MapStyleToggleProps) => (
  <div
    className="viewBoxWrapper"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {mapStyleOrder.map((style) => (
      <div
        key={style}
        id={style}
        className="viewBox"
        onClick={() => onStyleChange(style)}
        style={{
          display: mapStyle === style ? "flex" : "none",
          border:
            mapStyle === style ? `2px solid #646cff` : `2px solid transparent`,
        }}
      >
        {MAP_STYLES[style].image}
        <span>{MAP_STYLES[style].label}</span>
      </div>
    ))}
  </div>
);
