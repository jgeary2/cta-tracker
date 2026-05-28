import {XMLParser} from "fast-xml-parser";
import {TRAIN_API_MAPPING, TRAIN_API_REVERSE_MAPPING} from "./types.js";
import {transformArrivalData} from "./utils.js";

const logRequest = (requestUrl: string) => console.log(`${new Date().toISOString()}: ${requestUrl}`);

const fetchAndHandleResponse = async (service: string, queryString: string) => {
  const requestUrl = `https://lapi.transitchicago.com/api/1.0/${service}.aspx?key=${process.env.CTA_API_KEY}${queryString}`;

  logRequest(requestUrl);

  const response = await fetch(requestUrl);
  const xmlString = await response.text();
  const parser = new XMLParser({ignoreAttributes: false});
  return parser.parse(xmlString);
}
export const getTrains = async (line: string | null) => {
  let trainLine;
  if (line) {
    trainLine = TRAIN_API_MAPPING[line];
  } else {
    trainLine = Object.values(TRAIN_API_MAPPING).join(',');
  }
  const json = await fetchAndHandleResponse('ttpositions', `&rt=${trainLine}`);

  let routes = json.ctatt.route;
  if (!Array.isArray(routes)) {
    routes = [routes]
  }

  return routes.flatMap((route: any) => {
    if (!Array.isArray(route.train)) {
      route.train = [route.train];
    }

    return route.train.map((train: any) => {
      train.line = TRAIN_API_REVERSE_MAPPING[route['@_name']];
      return train;
    })
  });
}

export const getArrivals = async (runNumber: number, mapId: number) => {
  let service;
  let queryString;

  if (runNumber) {
    service = 'ttfollow';
    queryString = `&runnumber=${runNumber.toString().padStart(3, '0')}`;
  } else {
    service = 'ttarrivals';
    queryString = `&mapid=${mapId}`;
  }
  const json = await fetchAndHandleResponse(service, queryString);

  return transformArrivalData(json.ctatt.eta);
}