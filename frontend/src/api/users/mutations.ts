import {useMutation, useQueryClient} from "react-query";
import {
  apiAddNewProfileVisit,
  apiCheckAllProfileVisits,
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

      const userPage: any = queryClient.getQueryData(['users', 'one']);
      if (userPage) {
        await queryClient.cancelQueries(['users', 'one']);
        // const findUserIndex = prev.followedBy.findIndex((item: any) => item.id == data.profile.id)
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
      queryClient.invalidateQueries(['users', 'all']);
      queryClient.invalidateQueries(['users', 'filter']);

      // const followwers: any = queryClient.getQueryData(['favorites', 'all']);
      // if (followwers) {
      //   await queryClient.cancelQueries(['favorites', 'all']);
      //   const newArrayOFfollowedBy = followwers.following.filter(
      //     (item: any) => item.id != data.profile.id,
      //   );
      //   followwers.following = [...newArrayOFfollowedBy];
      //   queryClient.setQueryData(['favorites', 'all'], () => followwers);
      // }

      const prevAllFavorites: any = queryClient.getQueryData(['favorites', 'all', 'users']);
      if (prevAllFavorites) {
        await queryClient.invalidateQueries(['favorites', 'all', 'users']);
      }

      const userPage: any = queryClient.getQueryData(['users', 'one']);
      if (userPage) {
        await queryClient.cancelQueries(['users', 'one']);
        const newArrayOFfollowedBy = userPage.followedBy.filter((item: any) => item.id != user.id);
        userPage.followedBy = [...newArrayOFfollowedBy];
        queryClient.setQueryData(['users', 'one'], () => userPage);
      }

      // console.log(data)
      // const prev: any = queryClient.getQueryData(['user', 'one'])
      // if(prev){
      //     await queryClient.cancelQueries(['user', 'one'])
      //     console.log(prev)
      //     const findUserIndex = prev.followedBy.findIndex((item: any) => item.id == item.id)
      //     prev.followedBy.splice(findUserIndex, 1);
      //     queryClient.setQueryData(['user', 'one'], () => prev)
      // }

      // queryClient.invalidateQueries(['user', 'one'])
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
  const {fetchUser} = useStore((state: any) => state);
  const queryClient = useQueryClient();

  return useMutation(['profile', 'update'],
    (formData: any) => apiUpdateUserGeneralInfo(formData), {
      onSuccess: async (data: any) => {
        console.log(data)
        console.log(queryClient.getQueryData(['users', 'one']))
        fetchUser();
        await queryClient.invalidateQueries(['users', 'one']);
      },
      onError: (e: any) => {
        console.log(e);
      },
    });
};

export const useMutateUserProfileUpdatePerosnalInfo = () => {
  const {fetchUser} = useStore((state: any) => state);
  const queryClient = useQueryClient();
  return useMutation((userPeronalInfo: any) => apiUpdateUserPersonalInfo(userPeronalInfo), {
    onSettled: async () => {
      fetchUser();
      await queryClient.invalidateQueries(['users', 'one']);
    },
    onError: (e: any) => {
      console.log(e);
    },
  });
};

export const useMutateUserProfileUpdateMap = () => {
  const {fetchUser} = useStore((state: any) => state);
  const queryClient = useQueryClient();
  return useMutation((countries: string[]) => apiUpdateUserMap(countries), {
    onSettled: async () => {
      fetchUser();
      await queryClient.invalidateQueries(['users', 'one']);
    },
    onError: (e: any) => {
      console.log(e);
    },
  });
};

export const useMutateAddNewProfileVisit = () => {
  const {fetchUser} = useStore((state: any) => state);
  const queryClient = useQueryClient();
  return useMutation((userId: any) => apiAddNewProfileVisit(userId), {
    onSettled: async () => {
      // fetchUser();
      // await queryClient.invalidateQueries(['users', 'one']);
    },
    onError: (e: any) => {
      console.log(e);
    },
  });
};