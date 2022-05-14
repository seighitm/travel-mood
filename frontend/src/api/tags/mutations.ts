import {useMutation, useQueryClient} from "react-query";
import {showNotification} from "@mantine/notifications";
import {deleteTag} from "./axios";

export const useDeleteTag = (onSuccessEvent: any) => {
  const queryClient = useQueryClient();
  return useMutation((tags: any) => deleteTag({tags: tags}),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['tags', 'all'])
        onSuccessEvent()
      },
      onError: async (err: any) => {
        showNotification({
          title: 'Error',
          message: err.response?.data?.message,
          color: 'red',
        });
      },
    }
  );
};
