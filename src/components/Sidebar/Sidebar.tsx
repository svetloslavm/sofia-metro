import { FC, RefObject, useMemo } from "react";
import { MapRef } from "react-map-gl/mapbox";

import { getExistingFeatures } from "utils";
import { SidebarControls, StationList } from "components";

import stations from "assets/geojson/mgt_metro_spirki_26_sofpr_20210308.json";

import "./Sidebar.css";

interface SidebarProps {
  mapRef: RefObject<MapRef | null>;
  isPlannedVisible: boolean;
  togglePlanned: () => void;
  areEntrancesVisible: boolean;
  toggleEntrances: () => void;
  isAccessibilityVisible: boolean;
  toggleAccessibility: () => void;
}

export const Sidebar: FC<SidebarProps> = ({
  mapRef,
  isPlannedVisible,
  togglePlanned,
  areEntrancesVisible,
  toggleEntrances,
  isAccessibilityVisible,
  toggleAccessibility,
}) => {
  const stationFeatures = useMemo(
    () =>
      isPlannedVisible ? stations.features : getExistingFeatures(stations),
    [isPlannedVisible]
  );

  return (
    <div className="sidebar">
      <SidebarControls
        isPlannedVisible={isPlannedVisible}
        togglePlanned={togglePlanned}
        areEntrancesVisible={areEntrancesVisible}
        toggleEntrances={toggleEntrances}
        isAccessibilityVisible={isAccessibilityVisible}
        toggleAccessibility={toggleAccessibility}
      />
      <h3>Stations</h3>
      <hr />
      <StationList mapRef={mapRef} stationFeatures={stationFeatures} />
    </div>
  );
};
