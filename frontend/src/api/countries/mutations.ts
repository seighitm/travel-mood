import {useMutation, useQueryClient} from "react-query";
import {addCountries, removeCountries} from "./axios";

export const useMutateRemoveCountries = (onSuccessEvent: any) => {
  const queryClient = useQueryClient();
  return useMutation(['countries', 'remove'], ({countries}: any) => removeCountries({countries}), {
    onSuccess: async () => {
      onSuccessEvent()
      await queryClient.invalidateQueries(['countries'])
    },
  });
};

export const useMutateAddCountries = (onSuccessEvent: any) => {
  const queryClient = useQueryClient();
  return useMutation(['countries', 'add'], (countries: any) => addCountries({countries}), {
    onSuccess: async () => {
      onSuccessEvent()
      await queryClient.invalidateQueries(['countries'])
    },
  });
};
