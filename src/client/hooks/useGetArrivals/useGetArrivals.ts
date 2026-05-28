import {loader} from "graphql.macro";
import {useLazyQuery} from "@apollo/client/react";
import {GetArrivalsResponse, GetArrivalsVars} from "../../model/types";

export const useGetArrivals = () => {
  const query = loader('./GetArrivals.graphql')
  return useLazyQuery<GetArrivalsResponse, GetArrivalsVars>(query, {
    fetchPolicy: "network-only",
  });
}