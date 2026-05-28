import {useGetArrivals} from "../hooks/useGetArrivals/useGetArrivals";
import {useEffect, useState} from "react";
import React from "react";
import {ListGroup, Offcanvas} from "react-bootstrap";
import {COLOR_MAPPING} from "../model/constants";
import AccessibleIcon from '@mui/icons-material/Accessible';
import {Arrival, GetArrivalsVars} from "../model/types";

interface Props {
  adaMap: Map<number, boolean>;
  trainLine: string | null,
  setSelectedLine(selectedLine: string): void;
  selectedTrain: number | null,
  setSelectedTrain(selectedTrain: number | null): void;
  selectedStation: number | null,
  setSelectedStation(selectedStation: number | null): void;
}

export const ArrivalTimes = ({
  adaMap,
  trainLine,
  setSelectedLine,
  selectedTrain,
  setSelectedTrain,
  selectedStation,
  setSelectedStation,
}: Props) => {
  const [getArrivals, getArrivalsResponse] = useGetArrivals();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    setSelectedTrain(null);
    setSelectedStation(null);
  }

  const handleSelectArrival = (arrival: Arrival) => {
    if (!!selectedTrain) { // Selecting a station
      setSelectedStation(arrival.stationId);
      setSelectedTrain(null);
    } else { // Selecting a train run
      setSelectedStation(null);
      setSelectedTrain(arrival.rn);

      if (arrival.line !== trainLine) {
        setSelectedLine(arrival.line);
      }
    }
  }

  useEffect(() => {
    const variables: GetArrivalsVars = {}
    
    if (selectedTrain) {
      variables.runNumber = selectedTrain;
    } else if (selectedStation) {
      variables.mapId = selectedStation;
    }
    
    if (selectedTrain || selectedStation) {
      getArrivals({
        variables,
      });
    }
  }, [selectedTrain, selectedStation, getArrivals]);
  
  if (getArrivalsResponse.error) {
    return <p>getTrainRunArrivalsResponse.error</p>
  }

  if (getArrivalsResponse.loading) {
    return <p>Loading...</p>
  }

  const arrivals = getArrivalsResponse.data?.getArrivals;

  const heading = selectedTrain ? `${trainLine} Line` : arrivals?.[0]?.stationName;
  return (
    <Offcanvas className="arrivals-drawer" placement="end" show={isOpen} onHide={handleClose}>
      <Offcanvas.Header
        className="arrivals-header"
      >
        <span>{heading}</span>
        {selectedStation && adaMap.get(selectedStation) ? (
          <AccessibleIcon style={{fontSize: '40'}}/>
        ) : null}
      </Offcanvas.Header>
      {selectedTrain ? (
        <div className="arrivals-train-run">
          #{selectedTrain} to {arrivals?.[0]?.destination}
        </div>
        ) : null}
      <ListGroup className="arrivals-list">
        {arrivals?.map(arrival => {
            const label = selectedTrain ? arrival.stationName : arrival.destination;

            return (
              <ListGroup.Item
                className="arrivals-item"
                onClick={() => handleSelectArrival(arrival)}
                disabled={arrival.isScheduled}
                style={{backgroundColor: COLOR_MAPPING[arrival.line || trainLine || 'lightgrey']}}
              >
                <span>
                  {arrival.isScheduled && '* '}
                  {label}: {arrival.isDue ? 'Due' : arrival.isDelayed ? 'Delayed' : `${arrival.arrivalTime} mins`}
                </span>
                {selectedTrain && adaMap.get(arrival.stationId) ? (<AccessibleIcon style={{fontSize: '28'}}/>) : null }
                <span className="run-number float-right">#{arrival.rn}</span>
              </ListGroup.Item>
            )
          }
        )}
      </ListGroup>
    </Offcanvas>
  )
}