import { MetroStatus } from "enums";

export interface MetroStation {
  id: number;
  objectid: number;
  layer: MetroStatus;
  shape_area: number | null;
  shape_len: number | null;
  stancia: string | null;
}
