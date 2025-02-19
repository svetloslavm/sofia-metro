import { MetroStatus } from "enums";

export const getExistingFeatures = (data: any) =>
  data.features
    .filter(
      (feature: any) =>
        feature.properties.layer === MetroStatus.EXISTING ||
        feature.properties.sastoyanie === MetroStatus.EXISTING
    )
    .sort((a: any, b: any) =>
      (a.properties.stancia ?? "").localeCompare(b.properties.stancia ?? "")
    );
