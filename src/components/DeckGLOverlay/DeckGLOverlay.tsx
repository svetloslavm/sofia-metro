import { useControl } from "react-map-gl/mapbox";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { DeckProps } from "@deck.gl/core";

export const DeckGLOverlay = (props: DeckProps) => {
  const overlay = useControl<any>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
};
