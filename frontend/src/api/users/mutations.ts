import {useMutation, useQueryClient} from "react-query";
import {
  apiAddNewProfileVisit,
  apiCheckAllProfileVisits,
  apiSendComplaint,
  apiSetUserRating,
  apiSwitchUserRole,
  apiUpdateUser,
  apiUpdateUserGeneralInfo,
  apiUpdateUserImages,
  apiUpdateUserMap,
  apiUpdateUserPersonalInfo,
  apiUserAccountActivate,
  apiUserAccountBlock,
  apiUserFollow,
  apiUserUnFollow,
} from "./axios";
import useStore from "../../store/user.store";

//##################################################################################
//##################################################################################
export const useUserAccountActivate = () => {
  const queryClient = useQueryClient();
  return useMutation(({userId}: any) => apiUserAccountActivate({userId}),
    {
      onSettled: async () => {
        await queryClient.invalidateQueries(['userFiltering'])
      }
    });
};

//##################################################################################
//##################################################################################
export const useUserAccountBlock = () => {
  const queryClient = useQueryClient();
  return useMutation(({userId, expiredBlockDate}: any) => apiUserAccountBlock({userId, expiredBlockDate}),
    {
      onSettled: async () => {
        await queryClient.invalidateQueries(['userFiltering'])
      }
    });
};

//##################################################################################
//##################################################################################
export const useMutateSwitchUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation(({userId}: any) => apiSwitchUserRole({userId}),
    {
      onSuccess: async (data: any) => {
        await queryClient.invalidateQueries(['userFiltering'])

        // const prevUserProfile: any = await queryClient.getQueryData(['users', 'filter']);
        // if (prevUserProfile) {
        //   await queryClient.cancelQueries(['users', 'filter']);
        //   const findUserIndex = prevUserProfile.findIndex((user: any) => user.id == data.id)
        //   prevUserProfile[findUserIndex] = {
        //     ...prevUserProfile[findUserIndex],
        //     role: data.role,
        //   }
        //   queryClient.setQueryData(['users', 'filter'], () => prevUserProfile);
        // }
      }
    });
};

//##################################################################################
//##################################################################################
export const useMutateSetUserRating = () => {
  const queryClient = useQueryClient();
  return useMutation(({userId, rating}: any) => apiSetUserRating({userId, rating}),
    {
      onSettled: async (data: any) => {
        const prevUserProfile: any = await queryClient.getQueryData(['users', 'one']);
        if (prevUserProfile) {
          await queryClient.cancelQueries(['users', 'one']);
          prevUserProfile.rating = data;
          queryClient.setQueryData(['users', 'one'], () => prevUserProfile);
        }
      },
    });
};

//##################################################################################
//##################################################################################
export const useFollowMutate = (state: any) => {
  const queryClient = useQueryClient();
  const {user} = useStore((state: any) => state);

  return useMutation(['users', state], (userId: any) => apiUserFollow(userId), {
    onSettled: async (data: any) => {
      console.log(data)

      queryClient.invalidateQueries(['users', 'all']);
      queryClient.invalidateQueries(['users', 'filter']);
      // queryClient.invalidateQueries(['favorites', 'all'])

      // const prev: any = queryClient.getQueryData(['user', 'one'])
      //
      // console.log(data)
      //
      // if(prev){
      //     await queryClient.cancelQueries(['user', 'one'])
      //     console.log(prev)
      //     // const findUserIndex = prev.followedBy.findIndex((item: any) => item.id == item.id)
      //     prev.followedBy.push({...data.profile})
      //
      //     queryClient.setQueryData(['user', 'one'], () => prev)
      // }

      const userPage: any = queryClient.getQueryData(['users', 'one', data?.profile?.id.toString()]);
      if (userPage) {
        await queryClient.cancelQueries(['users', 'one', data?.profile?.id.toString()]);
        userPage.followedBy.push({...user});
        queryClient.setQueryData(['users', 'one'], () => userPage);
      }
    },
  });
};

//##################################################################################
//##################################################################################
export const useUnFollowMutate = (state: any) => {
  const queryClient = useQueryClient();
  const {user} = useStore((state: any) => state);

  return useMutation((userId: any) => apiUserUnFollow(userId), {
    onSettled: async (data: any) => {
      console.log(data)
      const prevAllUsers: any = queryClient.getQueryData(['users', 'all']);
      if (prevAllUsers) await queryClient.invalidateQueries(['users', 'all']);

      const prevAllFilteringUsers: any = queryClient.getQueryData(['users', 'filter']);
      if (prevAllFilteringUsers) await queryClient.invalidateQueries(['users', 'filter']);

      const prevAllFollowingUsers: any = queryClient.getQueryData(['favorites', 'all', 'Users']);
      if (prevAllFollowingUsers) await queryClient.invalidateQueries(['favorites', 'all', 'Users']);

      const prevAllFavoritesArticles: any = queryClient.getQueryData(['favorites', 'all', 'Articles']);
      if (prevAllFavoritesArticles) await queryClient.invalidateQueries(['favorites', 'all', 'Articles']);

      const prevAllFavoritesTrips: any = queryClient.getQueryData(['favorites', 'all', 'Trips']);
      if (prevAllFavoritesTrips) await queryClient.invalidateQueries(['favorites', 'all', 'Trips']);

      const userPage: any = queryClient.getQueryData(['users', 'one', data?.profile?.id.toString()]);
      if (userPage) {
        await queryClient.cancelQueries(['users', 'one', data?.profile?.id]);
        const newArrayOFfollowedBy = userPage.followedBy.filter((item: any) => item.id != user.id);
        userPage.followedBy = [...newArrayOFfollowedBy];
        queryClient.setQueryData(['users', 'one'], () => userPage);
      }
    },
  });
};

//##################################################################################
//##################################################################################
export const useCheckAllProfileView = () => {
  const queryClient = useQueryClient();
  return useMutation(['profile', 'read'], () => apiCheckAllProfileVisits(), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['users', 'profile-visits']);
    },
  });
};

//##################################################################################
//##################################################################################
export const useMutateUserProfileUpdate = () => {
  const {fetchUser} = useStore((state: any) => state);
  const queryClient = useQueryClient();

  return useMutation(['profile', 'update'],
    (formData: any) => apiUpdateUser(formData), {
      onSettled: async (data: any) => {
        // console.log(data);

        // const prev: any = queryClient.getQueryData(['user', 'one']);
        // if (prev) {
        //   await queryClient.cancelQueries(['user', 'one']);
        //   // prev.picture = data.picture;
        //   prev.images = data?.images;
        //   queryClient.setQueryData(['user', 'one'], () => prev);
        // }

        // localStorage.setItem('accessToken', data.accessToken);
        fetchUser();
        await queryClient.invalidateQueries(['users', 'one']);
      },
      onError: (e: any) => {
        console.log(e);
      },
    });
};


export const useMutateUserProfileUpdateImages = () => {
  const {fetchUser} = useStore((state: any) => state);
  const queryClient = useQueryClient();

  return useMutation(['profile', 'update'],
    (formData: any) => apiUpdateUserImages(formData), {
      onSettled: async (data: any) => {
        fetchUser();
        await queryClient.invalidateQueries(['users', 'one']);
      },
      onError: (e: any) => {
        console.log(e);
      },
    });
};

export const useMutateUserProfileUpdateGeneralInfo = () => {
  const {fetchUser, user} = useStore((state: any) => state);
  const queryClient = useQueryClient();

  return useMutation(['profile', 'update'],
    (formData: any) => apiUpdateUserGeneralInfo(formData), {
      onSuccess: async (data: any) => {
        fetchUser();
        await queryClient.invalidateQueries(['users', 'one', user?.id]);
      },
      onError: (e: any) => {
        console.log(e);
      },
    });
};

export const useMutateUserProfileUpdatePerosnalInfo = () => {
  const {fetchUser, user} = useStore((state: any) => state);
  const queryClient = useQueryClient();
  return useMutation((userPeronalInfo: any) => apiUpdateUserPersonalInfo(userPeronalInfo), {
    onSettled: async () => {
      fetchUser();
      await queryClient.invalidateQueries(['users', 'one', user?.id]);
    },
    onError: (e: any) => {
      console.log(e);
    },
  });
};

export const useMutateUserProfileUpdateMap = () => {
  const {fetchUser, user} = useStore((state: any) => state);
  const queryClient = useQueryClient();
  return useMutation((countries: string[]) => apiUpdateUserMap(countries), {
    onSettled: async () => {
      fetchUser();
      await queryClient.invalidateQueries(['users', 'one', user?.id]);
    },
    onError: (e: any) => {
      console.log(e);
    },
  });
};

export const useMutateAddNewProfileVisit = () => {
  const {user} = useStore((state: any) => state);
  const queryClient = useQueryClient();
  return useMutation((userId: any) => apiAddNewProfileVisit(userId), {
    onSettled: async () => {
      await queryClient.invalidateQueries(['users', 'one', user?.id]);
    },
  });
};

//##################################################################################
//##################################################################################
export const useMutateSendComplaint = ({profileId}: { profileId: string | number }) => {
  return useMutation((complaintPayload: any) => apiSendComplaint({profileId, complaintPayload}), {});
};
