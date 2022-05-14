import {useMutation} from "react-query";
import {addPlace} from "./axios";

export const useMutateAddArticleMarker = () => {
  return useMutation((markerPayload: any) => addPlace({markerPayload: markerPayload}));
};
