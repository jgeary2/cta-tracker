export interface Train {
  heading: number;
  rn: number;
  lat: number;
  lon: number;
  nextStaNm: string;
  line: string;
}

export interface Arrival {
  stationId: number;
  stationName: string;
  serviceDir: string;
  rn: number;
  line: string;
  destination: string;
  arrivalTime: number;
  isDue: boolean;
  isScheduled: boolean;
  isDelayed: boolean;
}

export interface Station {
  stopId: number;
  directionId: string;
  stopName: string;
  stationName: string;
  stationDescriptiveName: string;
  mapId: number;
  ada: boolean;
  red: boolean;
  blue: boolean;
  green: boolean;
  brown: boolean;
  purple: boolean;
  yellow: boolean;
  pink: boolean;
  orange: boolean;
  lat: number;
  lon: number;
}

export interface GetTrainsVars {
  line: string | null;
}

export interface GetTrainsResponse {
  getTrains: Train[];
}

export interface GetArrivalsVars {
  runNumber?: number;
  mapId?: number;
}

export interface GetArrivalsResponse {
  getArrivals: Arrival[];
}