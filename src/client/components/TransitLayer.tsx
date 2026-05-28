import {useMap} from "@vis.gl/react-google-maps";
import {useEffect} from "react";

export const TransitLayer = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setValues()
    transitLayer.setMap(map);

    return () => transitLayer.setMap(null);
  });

  return null;
}