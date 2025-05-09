import { MetroStatus } from "enums";
import { MetroLineProperties } from "typings";

export const getExistingFeatures = (data: {
  features: MetroLineProperties[];
}) =>
  data.features
    .filter(
      (feature) =>
        feature.properties.layer === MetroStatus.EXISTING ||
        feature.properties.sastoyanie === MetroStatus.EXISTING
    )
    .sort((a, b) =>
      (a.properties.stancia ?? "").localeCompare(b.properties.stancia ?? "")
    );
