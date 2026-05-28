import {loader} from "graphql.macro";
import {useLazyQuery} from "@apollo/client/react";
import {GetTrainsResponse, GetTrainsVars} from "../../model/types";

export const useGetTrains = () => {
  const query = loader('./GetTrains.graphql')
  return useLazyQuery<GetTrainsResponse, GetTrainsVars>(query, {
    fetchPolicy: "network-only",
  });
}