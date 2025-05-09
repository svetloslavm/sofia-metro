import { Geometry } from "geojson";

export type MetroStationGeometry = Geometry & {
  connections: number[];
  center: number[];
};
