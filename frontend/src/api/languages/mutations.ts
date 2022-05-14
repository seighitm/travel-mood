import {useMutation, useQueryClient} from "react-query";
import {addLanguages, removeLanguages} from "./axios";

export const useMutateRemoveLanguages = (onSuccessEvent: any) => {
  const queryClient = useQueryClient();
  return useMutation(({languages}: any) => removeLanguages({languages}), {
    onSuccess: async (data: any) => {
      onSuccessEvent()
      await queryClient.invalidateQueries(['languages'])
    },
  });
};

export const useMutateAddLanguages = (onSuccessEvent: any) => {
  const queryClient = useQueryClient();
  return useMutation((languages: any) => addLanguages({languages}), {
    onSuccess: async (data: any) => {
      // const prevLanguages: any = queryClient.getQueryData(['languages']);
      // if (prevLanguages) {
      //   await queryClient.cancelQueries(['languages']);
      //   prevLanguages.push(...data?.languages?.map((language: any, index: number) => ({
      //     id: prevLanguages?.length == 0 ? index : prevLanguages[prevLanguages.length - 1].id + index,
      //     name: language,
      //     tripCount: 0,
      //     userCount: 0
      //   })));
      //   queryClient.setQueryData(['languages'], () => prevLanguages);
      // }
      onSuccessEvent()
      await queryClient.invalidateQueries(['languages'])
    },
  });
};
