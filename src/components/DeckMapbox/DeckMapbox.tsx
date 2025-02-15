// import Map, {
//   FullscreenControl,
//   NavigationControl,
//   useControl,
// } from "react-map-gl/mapbox";
// import { MapboxOverlay } from "@deck.gl/mapbox";
// import { COORDINATE_SYSTEM, DeckGLProps, PointCloudLayer } from "deck.gl";
// import { DataType } from "typings";

// import "mapbox-gl/dist/mapbox-gl.css";

// const POINT_CLOUD =
//   "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/pointcloud.json";

// const INITIAL_VIEW_STATE = {
//   longitude: -122.4,
//   latitude: 37.74,
//   zoom: 13,
//   pitch: 60,
//   bearing: 0,
// };

// const DeckGLOverlay = (props: DeckGLProps) => {
//   const overlay = useControl(() => new MapboxOverlay(props) as any);
//   overlay.setProps(props);
//   return null;
// };

// export const DeckMapbox = () => {
//   const layers = [
//     new PointCloudLayer<DataType>({
//       id: "PointCloudLayer",
//       data: POINT_CLOUD,
//       getColor: ({ color }) => color,
//       getNormal: ({ normal }) => normal,
//       getPosition: ({ position }) => position,
//       pointSize: 2,
//       coordinateOrigin: [-122.4, 37.74, 0],
//       coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
//       pickable: true,
//     }),
//   ];

//   return (
//     <Map
//       style={{ position: "absolute", top: 0, left: 0 }}
//       mapStyle="mapbox://styles/mapbox/light-v9"
//       initialViewState={INITIAL_VIEW_STATE}
//       mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
//     >
//       <DeckGLOverlay
//         layers={layers}
//         getTooltip={({ object }) => object?.position.join(", ") ?? null}
//       />
//       <NavigationControl position="top-right" />
//       <FullscreenControl position="top-right" />
//     </Map>
//   );
// };

import { useEffect, useState } from "react";
import Map, {
  FullscreenControl,
  NavigationControl,
  useControl,
} from "react-map-gl/mapbox";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { COORDINATE_SYSTEM, DeckGLProps, PointCloudLayer } from "deck.gl";
import { load } from "@loaders.gl/core";
import { LASLoader } from "@loaders.gl/las";

import "mapbox-gl/dist/mapbox-gl.css";

const INITIAL_VIEW_STATE = {
  longitude: -122.4,
  latitude: 37.74,
  zoom: 5,
  pitch: 0,
  bearing: 0,
};

const LAZ_SAMPLE =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/point-cloud-laz/indoor.0.1.laz";

const DeckGLOverlay = (props: DeckGLProps) => {
  const overlay = useControl(() => new MapboxOverlay(props) as any);
  overlay.setProps(props);
  return null;
};

export const DeckMapbox = () => {
  const [pointCloudData, setPointCloudData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await load(
        // "/public/NEONDSSampleLiDARPointCloud.las",
        // "/public/CA_SoCal_Wildfires.laz",
        LAZ_SAMPLE,
        LASLoader
      );
      setPointCloudData(data);
    };

    fetchData();
  }, []);

  const layers = [
    new PointCloudLayer({
      id: "PointCloudLayer",
      data: pointCloudData,
      getPosition: (d) => d.position,
      getNormal: [0, 0, 0],
      getColor: [255, 255, 255],
      pointSize: 0.5,
      coordinateOrigin: [-122.4, 37.74, 0],
      coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
      // opacity: 0.5,
    }),
  ];

  return (
    <Map
      style={{ position: "absolute", top: 0, left: 0 }}
      mapStyle="mapbox://styles/mapbox/light-v9"
      initialViewState={INITIAL_VIEW_STATE}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
    >
      <DeckGLOverlay
        layers={layers}
        getTooltip={({ object }) => object?.position.join(", ") ?? null}
      />
      <NavigationControl position="top-right" />
      <FullscreenControl position="top-right" />
    </Map>
  );
};
