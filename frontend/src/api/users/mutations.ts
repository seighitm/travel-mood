import { useMutation, useQueryClient } from 'react-query';
import {
  apiAddImageCaption,
  apiAddNewProfileVisit,
  apiCheckAllProfileVisits,
  apiSendComplaint,
  apiSetUserRating,
  apiUpdateUserGeneralInfo,
  apiUpdateUserImages,
  apiUpdateUserMap,
  apiUpdateUserPersonalInfo,
  apiUserFollow,
  apiUserUnFollow,
} from './axios';
import useStore from '../../store/user.store';
import { showNotification } from '@mantine/notifications';
import { IUser } from '../../types/IUser';
import { isNullOrUndefined } from '../../utils/primitive-checks';

export const useMutateSetUserRating = () => {
  const queryClient = useQueryClient();
  return useMutation(({ userId, rating }: any) => apiSetUserRating({ userId, rating }), {
    onSuccess: async (data: any) => {
      const prevUserProfile: IUser | undefined = await queryClient.getQueryData([
        'users',
        'one',
        data?.profileId.toString(),
      ]);
      if (prevUserProfile) {
        await queryClient.cancelQueries(['users', 'one', data?.profileId.toString()]);
        prevUserProfile.rating = data;
        prevUserProfile.myRatings = data?.myRatings;
        queryClient.setQueryData(
          ['users', 'one', data?.profileId.toString()],
          () => prevUserProfile
        );
      }
    },
  });
};

export const useFollowMutate = () => {
  const queryClient = useQueryClient();
  const { user } = useStore((state: any) => state);
  return useMutation((userId: any) => apiUserFollow(userId), {
    onSuccess: async (data: any) => {
      const prev: IUser[] | undefined = await queryClient.getQueryData(['users', 'filter']);
      if (prev) {
        await queryClient.cancelQueries(['users', 'filter']);
        const findUserIndex: number = prev.findIndex((us: IUser) => us.id == data?.profile.id);
        if (!isNullOrUndefined(findUserIndex)) {
          prev[findUserIndex].followedBy?.push({ id: user.id });
        }
        queryClient.setQueryData(['users', 'filter'], () => prev);
      }

      const userPage: IUser | undefined = queryClient.getQueryData([
        'users',
        'one',
        data?.profile?.id.toString(),
      ]);
      if (userPage) {
        await queryClient.cancelQueries(['users', 'one', data?.profile?.id.toString()]);
        userPage.followedBy?.push({ ...user });
        queryClient.setQueryData(['users', 'one', data?.profile?.id.toString()], () => userPage);
      }
    },
  });
};

export const useUnFollowMutate = () => {
  const queryClient = useQueryClient();
  const { user } = useStore((state: any) => state);
  return useMutation((userId: any) => apiUserUnFollow(userId), {
    onSuccess: async (data: any) => {
      const prevAllFilteringUsers: IUser[] | undefined = await queryClient.getQueryData([
        'users',
        'filter',
      ]);
      if (prevAllFilteringUsers) {
        await queryClient.invalidateQueries(['users', 'filter']);
      }

      const prevAllFollowingUsers: IUser[] | undefined = await queryClient.getQueryData([
        'favorites',
        'all',
        'users',
      ]);
      if (prevAllFollowingUsers) {
        await queryClient.invalidateQueries(['favorites', 'all', 'users']);
      }

      const userPage: IUser | undefined = queryClient.getQueryData([
        'users',
        'one',
        data?.profile?.id.toString(),
      ]);
      if (userPage) {
        await queryClient.cancelQueries(['users', 'one', data?.profile?.id.toString()]);
        const newArrayOFfollowedBy: IUser[] | any = userPage.followedBy?.filter(
          (item: any) => item.id != user.id
        );
        userPage.followedBy = [...newArrayOFfollowedBy];
        queryClient.setQueryData(['users', 'one', data?.profile?.id.toString()], () => userPage);
      }
    },
  });
};

export const useCheckAllProfileView = () => {
  const queryClient = useQueryClient();
  return useMutation(() => apiCheckAllProfileVisits(), {
    onSuccess: async () => {
      const prevUserProfileVisits: IUser | undefined = await queryClient.getQueryData([
        'users',
        'profile-visits',
      ]);
      if (prevUserProfileVisits) {
        await queryClient.invalidateQueries(['users', 'profile-visits']);
      }
    },
  });
};

export const useMutateUserProfileUpdateImages = () => {
  const { fetchUser } = useStore((state: any) => state);
  const queryClient = useQueryClient();
  return useMutation((formData: any) => apiUpdateUserImages(formData), {
    onSuccess: async (data: any) => {
      fetchUser();
      const prevUserProfile: IUser | undefined = await queryClient.getQueryData([
        'users',
        'one',
        data?.id.toString(),
      ]);
      if (prevUserProfile) {
        await queryClient.invalidateQueries(['users', 'one', data?.id.toString()]);
      }
    },
    onError: async (err: any) => {
      showNotification({
        title: 'Error!',
        message: err.response?.data?.message,
        color: 'red',
      });
    },
  });
};

export const useMutateAddImageCaption = (onSuccessEvent: () => void) => {
  const { fetchUser } = useStore((state: any) => state);
  const queryClient = useQueryClient();
  return useMutation(({ caption, imageId }: any) => apiAddImageCaption(caption, imageId), {
    onSuccess: async (data: any) => {
      fetchUser();
      if (onSuccessEvent) {
        onSuccessEvent();
      }
      const prevUserProfile: IUser | undefined = await queryClient.getQueryData([
        'users',
        'one',
        data?.userId.toString(),
      ]);
      if (prevUserProfile) {
        await queryClient.invalidateQueries(['users', 'one', data?.userId.toString()]);
      }
    },
    onError: async (err: any) => {
      showNotification({
        title: 'Error!',
        message: err.response?.data?.message,
        color: 'red',
      });
    },
  });
};

export const useMutateUserProfileUpdateGeneralInfo = (onSuccessEvent?: () => void) => {
  const { fetchUser, user } = useStore((state: any) => state);
  const queryClient = useQueryClient();
  return useMutation(['profile', 'update'], (formData: any) => apiUpdateUserGeneralInfo(formData), {
    onSuccess: async (data: any) => {
      fetchUser();
      if (onSuccessEvent) onSuccessEvent();
      const prevUserProfile: IUser | undefined = await queryClient.getQueryData([
        'users',
        'one',
        user?.id.toString(),
      ]);
      if (prevUserProfile) {
        await queryClient.invalidateQueries(['users', 'one', user?.id.toString()]);
      }
    },
    onError: async (err: any) => {
      showNotification({
        title: 'Error!',
        message: err.response?.data?.message,
        color: 'red',
      });
    },
  });
};

export const useMutateUserProfileUpdatePersonalInfo = () => {
  const { fetchUser, user } = useStore((state: any) => state);
  const queryClient = useQueryClient();
  return useMutation((userPersonalInfo: any) => apiUpdateUserPersonalInfo(userPersonalInfo), {
    onSuccess: async () => {
      fetchUser();
      const prevUserProfile: IUser | undefined = await queryClient.getQueryData([
        'users',
        'one',
        user?.id.toString(),
      ]);
      if (prevUserProfile) {
        await queryClient.invalidateQueries(['users', 'one', user?.id.toString()]);
      }
    },
    onError: async (err: any) => {
      showNotification({
        title: 'Error!',
        message: err.response?.data?.message,
        color: 'red',
      });
    },
  });
};

export const useMutateUserProfileUpdateMap = () => {
  const { fetchUser, user } = useStore((state: any) => state);
  const queryClient = useQueryClient();
  return useMutation((countries: any) => apiUpdateUserMap(countries), {
    onSuccess: async () => {
      fetchUser();
      const prevUserProfile: IUser | undefined = await queryClient.getQueryData([
        'users',
        'one',
        user?.id.toString(),
      ]);
      if (prevUserProfile) {
        await queryClient.invalidateQueries(['users', 'one', user?.id.toString()]);
      }
    },
    onError: async (err: any) => {
      showNotification({
        title: 'Error!',
        message: err.response?.data?.message,
        color: 'red',
      });
    },
  });
};

export const useMutateAddNewProfileVisit = () => {
  const { user } = useStore((state: any) => state);
  const queryClient = useQueryClient();
  return useMutation((userId: any) => apiAddNewProfileVisit(userId), {
    onSuccess: async () => {
      const prevUserProfile: IUser | undefined = await queryClient.getQueryData([
        'users',
        'one',
        user?.id.toString(),
      ]);
      if (prevUserProfile) {
        await queryClient.invalidateQueries(['users', 'one', user?.id.toString()]);
      }
    },
  });
};

export const useMutateSendComplaint = ({
  profileId,
  onSuccessEvent,
}: {
  profileId: string | number | undefined;
  onSuccessEvent?: () => void;
}) => {
  return useMutation((complaintPayload: any) => apiSendComplaint({ profileId, complaintPayload }), {
    onSuccess: () => {
      if (onSuccessEvent) {
        onSuccessEvent();
      }
      showNotification({
        title: 'Report successful send!',
        message: undefined,
      });
    },
    onError: (err: any) => {
      showNotification({
        title: 'Error',
        message: err.response?.data?.message,
        color: 'red',
      });
    },
  });
};
