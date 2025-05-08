import { MetroStatus } from "enums";
import { Feature } from "../types/Feature";

export const getExistingFeatures = (data: { features: Feature[] }) =>
  data.features
    .filter(
      (feature: Feature) =>
        feature.properties.layer === MetroStatus.EXISTING ||
        feature.properties.sastoyanie === MetroStatus.EXISTING
    )
    .sort((a: Feature, b: Feature) =>
      (a.properties.stancia ?? "").localeCompare(b.properties.stancia ?? "")
    );
