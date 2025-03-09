import { FC, RefObject } from "react";
import { MapRef } from "react-map-gl/mapbox";
import { center } from "@turf/turf";

import { getExistingFeatures } from "utils";

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
  const flyToStation = (feature: any) => {
    const featureCenter = center(feature);
    const [lng, lat] = featureCenter.geometry.coordinates;

    mapRef.current?.flyTo({
      zoom: 15,
      center: [lng, lat],
      essential: true,
    });
  };

  return (
    <div className="sidebar">
      <div>
        <input
          type="checkbox"
          checked={isPlannedVisible}
          onChange={togglePlanned}
        />
        Planned
        <br />
        <input
          type="checkbox"
          checked={areEntrancesVisible}
          onChange={toggleEntrances}
        />
        Entrances
        <br />
        <input
          type="checkbox"
          checked={isAccessibilityVisible}
          onChange={toggleAccessibility}
        />
        Accessibility
      </div>
      <h3>Stations</h3>
      <hr />
      <ul className="sidebar-list">
        {(isPlannedVisible
          ? stations.features
          : getExistingFeatures(stations)
        )?.map((feature: any) => (
          <li
            className="sidebar-item"
            key={feature.properties.id}
            onClick={() => flyToStation(feature)}
          >
            {feature.properties.stancia ?? feature.properties.id}
          </li>
        ))}
      </ul>
    </div>
  );
};
