import { center } from "@turf/turf";
import { FC, RefObject } from "react";
import { MapRef } from "react-map-gl/mapbox";

interface StationListProps {
  mapRef: RefObject<MapRef | null>;
  stationFeatures: GeoJSON.Feature[];
}

export const StationList: FC<StationListProps> = ({
  mapRef,
  stationFeatures,
}) => {
  const flyToStation = (feature: GeoJSON.Feature) => {
    const featureCenter = center(feature);
    const [lng, lat] = featureCenter.geometry.coordinates;

    mapRef.current?.flyTo({
      zoom: 15,
      center: [lng, lat],
      essential: true,
    });
  };

  if (!stationFeatures || stationFeatures.length == 0) return;

  return (
    <ul className="sidebar-list">
      {stationFeatures.map((feature) => (
        <li
          className="sidebar-item"
          key={feature.properties?.id}
          onClick={() => flyToStation(feature)}
        >
          {feature.properties?.stancia ?? feature.properties?.id}
        </li>
      ))}
    </ul>
  );
};
