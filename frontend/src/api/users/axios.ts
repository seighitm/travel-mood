import {$authHost, $host} from "../api";

export const apiGetAllProfileVisits = async () => {
  const {data} = await $authHost.get('/user/profile-visits');
  return data;
};

export const apiAddNewProfileVisit = async (userId: any) => {
  const {data} = await $authHost.put('user/profile-visits/' + userId);
  return data;
};

export const apiUpdateUserMap = async (countries: any) => {
  const {data} = await $authHost.put('user/map', countries);
  return data;
};

export const apiUpdateUserPersonalInfo = async (userPeronalInfo: any) => {
  const {data} = await $authHost.put('user/personal-info', userPeronalInfo);
  return data;
};

export const apiUpdateUserGeneralInfo = async (payload: any) => {
  const {data} = await $authHost.put('user/general-info', payload);
  return data;
};

export const apiUpdateUserImages = async (payload: any) => {
  const {data} = await $authHost.put('user/images', payload);
  return data;
};

export const apiCheckAllProfileVisits = async () => {
  const {data} = await $authHost.put('users/profile-visits');
  return data;
};

export const apiUpdateUser = async (payload: any) => {
  const {data} = await $authHost.put('users', payload);
  return data;
};

export const apiUserFollow = async (userId: string) => {
  const {data} = await $authHost.post(`user/${userId}/follow`);
  return data;
};

export const apiUserUnFollow = async (userId: string) => {
  const {data} = await $authHost.delete(`user/${userId}/follow`);
  return data;
};

export const apiGetUserById = async (id: any) => {
  const {data} = await $host.get('user/' + id);
  return data;
};

export const apiSetUserRating = async ({userId, rating}: any) => {
  const {data} = await $authHost.post(`user/${userId}/rating/${rating}`);
  return data;
};

export const apiSwitchUserRole = async ({userId}: any) => {
  const {data} = await $authHost.put(`user/${userId}/switch-role`);
  return data;
};

export const apiUserAccountBlock = async ({userId, expiredBlockDate}: any) => {
  const {data} = await $authHost.put(`user/${userId}/block`, {expiredBlockDate: expiredBlockDate.toString()});
  return data;
};

export const apiUserAccountActivate = async ({userId}: any) => {
  const {data} = await $authHost.put(`user/${userId}/activate`);
  return data;
};

export const getFavorites = async (queryKey: any) => {
  const res = await $authHost.get('user/all-favorites/' + queryKey);
  return res.data;
};

export const apiSendComplaint = async ({profileId, complaintPayload}: any) => {
  const {data} = await $authHost.post(`user/${profileId}/complaint`, complaintPayload);
  return data;
};

export const apiGetAllComplaints = async () => {
  const {data} = await $authHost.get(`users/complaint`);
  return data;
};

export const filterUsers = async (payload: any) => {
  const {data} = await $host.get('users', {
    params: {
      ...(payload?.name && payload?.name != ''
        ? {name: payload?.name}
        : {}),
      ...(payload?.age && payload?.age != ''
        ? {age: payload?.age}
        : {}),
      ...(payload?.sex && payload?.sex != ''
        ? {sex: payload?.sex}
        : {}),
      ...(payload?.languages != 0
        ? {languages: payload?.languages}
        : {}),
      ...(payload?.countries != 0
        ? {countries: payload?.countries}
        : {}),
      ...(payload?.tripTo != 0
        ? {tripTo: payload?.tripTo}
        : {}),
      ...(payload?.isOnline
        ? {isOnline: payload?.isOnline}
        : {}),
    },
  });
  return data;
};

export const getUsersWithAdminRole = async (
  page: any,
  limit: any,
  search: any,
  sortBy: any,
  order: any,
) => {
  const {data} = await $authHost.get('/admin/users',{
    params: {
      page,
      limit,
      ...(search ? { search } : {}),
      ...(sortBy ? { sortBy } : {}),
      ...(order ? { order } : {}),
    },
  } );
  return data;
};


//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// RAU
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

export const getUsers = async ({searchField}: any) => {
  const {data} = await $host.get('users', {
    params: {
      ...(searchField != undefined
        ? {searchField: searchField}
        : {}),
    },
  });
  return data;
};
