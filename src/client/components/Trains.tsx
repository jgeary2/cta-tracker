import {AdvancedMarker, useAdvancedMarkerRef, useMap} from "@vis.gl/react-google-maps";
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import DirectionsTransitFilledTwoToneIcon from '@mui/icons-material/DirectionsTransitFilledTwoTone';
import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone';
import React, {useEffect, useMemo, useState} from "react";
import {Dropdown, DropdownButton} from "react-bootstrap";
import {COLOR_MAPPING, TRAIN_LINES} from "../model/constants";
import {Station, Train} from "../model/types";
import {useGetTrains} from "../hooks/useGetTrains/useGetTrains";
import {ArrivalTimes} from "./ArrivalTimes";
import stationsJson from "../../data/stations.json";
import {
  getStationIconSize,
  getTrainIconSize
} from "../utils/utils";
import {TrainLines} from "./TrainLines";

export const Trains = () => {

  const [markerRef] = useAdvancedMarkerRef();
  const map = useMap();

  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [selectedTrain, setSelectedTrain] = useState<number | null>(null);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState(Date.now());
  const [displayedLine, setDisplayedLine] = useState<string | null>(null);
  const [trains, setTrains] = useState<Train[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [adaMap, setAdaMap] = useState<Map<number, boolean>>(new Map());

  const [getTrains, getTrainsResponse] = useGetTrains();

  const doGetTrains = () => {
    getTrains({
      variables: {
        line: selectedLine,
      }
    });
    setLastRefreshed(Date.now());
  }

  const handleLineSelect = (line: string | null) => {
    setSelectedLine(line);
    setSelectedTrain(null);
    setSelectedStation(null);
  }

  const handleTrainSelect = (rn: number, line: string) => {
    setSelectedLine(line)
    setSelectedTrain(rn);
    setSelectedStation(null);
  }

  const handleStationSelect = (mapId: number) => {
    setSelectedStation(mapId);
    setSelectedTrain(null);
  }

  const handleRefresh = () => {
    if (Date.now() - lastRefreshed > 10 * 1000) {
      doGetTrains();
    }
  }

  const stationMap = useMemo(() => {
    const initStations: Map<string, Station[]> = new Map([
      ['blue', []],
      ['red', []],
      ['brown', []],
      ['orange', []],
      ['green', []],
      ['pink', []],
      ['purple', []],
      ['yellow', []],
    ]);

    const map = new Map<string, Station[]>();
    initStations.forEach((station: Station[], line: string) => {
      const lineStations = stationsJson.filter((stationJson: any) =>
        stationJson[line] === true
      );

      map.set(line, lineStations);
    });

    return map;
  }, [])

  useEffect(() => {
    const adaVals = stationsJson.reduce((acc, stationJson) => {
      acc.set(stationJson.mapId, stationJson.ada);
      return acc;
    }, new Map<number, boolean>());

    setAdaMap(adaVals);
  }, [])

  useEffect(() => {
    doGetTrains();

    // Display stations for either the selected line or all stations
    if (selectedLine) {
      const lineStations = stationMap.get(selectedLine);
      if (lineStations) {
        setStations(lineStations);
      } else {
        setStations([]);
      }
    } else {
      setStations(Array.from(stationMap.values()).flat());
    }

  }, [selectedLine]);


  useEffect(() => {
    // Re-center the map on the selected train or station
    let selection: any;
    if (selectedTrain) {
      selection = trains.find((train: any) => train.rn === selectedTrain);
    } else if (selectedStation) {
      selection = stationsJson.find((station: any) => station.mapId === selectedStation);
    }

    if (map && selection) {
      map.setCenter({lat: selection.lat, lng: selection.lon});
    }

    // Trigger a refresh if closing the arrivals window
    if (!selectedTrain && !selectedStation) {
      handleRefresh();
    }
  }, [selectedTrain, selectedStation]);

  useEffect(() => {
    // Init train data
    const trainData: any = getTrainsResponse.data?.getTrains;
    if (trainData) {
      setTrains(trainData);
      setDisplayedLine(selectedLine);
    }
  }, [getTrainsResponse.data])

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     doGetTrains();
  //   }, 5 * 60 * 1000);
  //
  //   return () => clearTimeout(timer);
  // });

  if (getTrainsResponse?.loading) return null;
  if (getTrainsResponse?.error) {
    console.error(getTrainsResponse?.error);
    return null;
  }

  const dropdownLabel = selectedLine ? `${selectedLine} Line` : 'All Lines';

  return (
    <React.Fragment>
      <TrainLines selectedLine={selectedLine}/>
      {trains.length > 0 ?
        trains.map(({heading, lat, lon, rn, line}: Train) => (
          <React.Fragment>
            <AdvancedMarker
              anchorTop="-100%"
              clickable={true}
              onClick={() => handleTrainSelect(rn, line)}
              position={{lat, lng: lon}}
              ref={markerRef}
            >
              <DirectionsTransitFilledTwoToneIcon
                style={{
                  cursor: "pointer",
                  fill: COLOR_MAPPING[line],
                  fontSize: getTrainIconSize(rn, selectedTrain, selectedStation)
                }}
              />
            </AdvancedMarker>
            {selectedTrain === rn ? (
              <AdvancedMarker
                anchorTop="-250%"
                clickable={true}
                position={{lat, lng: lon}}
                ref={markerRef}>
                <ArrowCircleRightOutlinedIcon
                  style={{
                    cursor: "pointer",
                    fill: COLOR_MAPPING[line],
                    fontSize: 40
                  }}
                  sx={{transform: `rotate(${heading - 90}deg)`}}
                />
              </AdvancedMarker>
            ) : null}
          </React.Fragment>
        )) : null}
      {stations.map(({mapId, lat, lon}: Station) => (
        <React.Fragment>
          <AdvancedMarker
            anchorTop={"-50%"}
            clickable={false}
            position={{lat, lng: lon}}
            ref={markerRef}
          >
            <CircleTwoToneIcon
              onClick={() => handleStationSelect(mapId)}
              style={{
                cursor: "pointer",
                fill: "slategrey",
                fontSize: getStationIconSize(mapId, selectedStation)
              }}
            />
          </AdvancedMarker>
        </React.Fragment>
      ))}
      <div className="refresh-container">
        <RefreshOutlinedIcon onClick={handleRefresh} style={{fontSize: "60"}}/>
      </div>
      <div className="train-select">
        <DropdownButton
          className="train-select"
          id="train_lines_dropdown"
          onSelect={handleLineSelect}
          title={dropdownLabel}
          variant="secondary"
          size="lg"
        >
          <Dropdown.Item
            active={!displayedLine}
            eventKey={undefined}
            key={'All'}
          >
            All Lines
          </Dropdown.Item>
          {
            TRAIN_LINES.map((trainLine) =>
              <Dropdown.Item
                active={displayedLine === trainLine}
                eventKey={trainLine}
                key={trainLine}
                style={{color: COLOR_MAPPING[trainLine]}}
              >
                {trainLine} Line
              </Dropdown.Item>
            )
          }
        </DropdownButton>
      </div>
      {selectedTrain || selectedStation ? (
        <ArrivalTimes
          adaMap={adaMap}
          trainLine={selectedLine}
          setSelectedLine={setSelectedLine}
          selectedTrain={selectedTrain}
          setSelectedTrain={setSelectedTrain}
          selectedStation={selectedStation}
          setSelectedStation={setSelectedStation}
        />
      ) : null}
    </React.Fragment>
  );
}