import {TRAIN_API_REVERSE_MAPPING} from "./types.js";

export const transformArrivalData = (data: any[]) => {
  const currentTime = new Date();

  if (!Array.isArray(data)) {
    if (data) {
      data = [data]
    } else {
      data = [];
    }
  }
  return data?.map(arrival => {
    const year = arrival.arrT.slice(0, 4);
    const month = arrival.arrT.slice(4, 6);
    const day = arrival.arrT.slice(6, 8);
    const time = arrival.arrT.split(' ')[1];
    const arrivalDateTime = new Date(`${year}-${month}-${day} ${time}`);

    const diffInMs = Math.abs(arrivalDateTime.getTime() - currentTime.getTime());
    const arrivalTime = Math.floor(diffInMs / (1000 * 60));

    const line = TRAIN_API_REVERSE_MAPPING[arrival.rt.toLowerCase()];

    return {
      stationId: arrival.staId,
      stationName: arrival.staNm,
      serviceDir: arrival.stpDe,
      destination: arrival.destNm,
      rn: arrival.rn,
      line,
      arrivalTime,
      isDue: arrival.isApp,
      isScheduled: arrival.isSch,
      isDelayed: arrival.isDey || arrival.isFlt,
    }
  });
}