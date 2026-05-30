import {Polyline} from "@vis.gl/react-google-maps";
import React from "react";

import blueJson from "../../data/lines/blue.json";
import redJson from "../../data/lines/red.json";
import greenJson from "../../data/lines/green.json";
import brownJson from "../../data/lines/brown.json";
import yellowJson from "../../data/lines/yellow.json";
import pinkJson from "../../data/lines/pink.json";
import purpleJson from "../../data/lines/purple.json";
import orangeJson from "../../data/lines/orange.json";
import {COLOR_MAPPING} from "../model/constants";

interface Props {
  selectedLine: string;
}

export const TrainLines = ({selectedLine}: Props) => {

  const dataMap = {
    purple: purpleJson,
    yellow: yellowJson,
    blue: blueJson,
    pink: pinkJson,
    green: greenJson,
    orange: orangeJson,
    brown: brownJson,
    red: redJson,
  }

  return (
    <React.Fragment>
      {
        Object.keys(dataMap)
          .filter(key => !selectedLine || key === selectedLine)
          .map(line =>
            dataMap[line].map(segment =>
              <Polyline
                path={segment.the_geom.coordinates[0]}
                strokeColor={COLOR_MAPPING[line]}
                strokeWeight={4}
                strokeOpacity={1.0}
              />
            )
          )
      }
    </React.Fragment>
  );
}