import {getArrivals, getTrains} from "./services.js";

export const resolvers = {
  Query: {
    getTrains: async (_: any, args: { line: string }) => getTrains(args.line),
    getArrivals: async (_: any, args: { runNumber: number, mapId: number }) => getArrivals(args.runNumber, args.mapId),
  }
}