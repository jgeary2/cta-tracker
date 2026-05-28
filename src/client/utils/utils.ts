const defaultTrainIconSize = (selectedTrain: number | null, selectedStation: number | null): number =>
  selectedTrain || selectedStation ? 30 : 50;

export const getTrainIconSize = (run: number | null, selectedTrain: number | null, selectedStation: number | null): number =>
  run === selectedTrain ? 70 : defaultTrainIconSize(selectedTrain, selectedStation);

export const getStationIconSize = (station: number, selectedStation: number | null): number =>
  station === selectedStation ? 60 : 30;

export const getStationBackgroundIconSize = (station: number, selectedStation: number | null): number =>
  station === selectedStation ? 50 : 20;
