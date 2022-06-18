import { $authHost, $host } from '../api';
import { isEmptyArray, isEmptyString, isNullOrUndefined } from '../../utils/primitive-checks';

export const apiGetAllProfileVisits = async () => {
  const { data } = await $authHost.get('/user/profile-visits');
  return data;
};

export const apiAddNewProfileVisit = async (userId: any) => {
  const { data } = await $authHost.put(`user/profile-visits/${userId}`);
  return data;
};

export const apiUpdateUserMap = async (countries: any) => {
  const { data } = await $authHost.put('user/map', countries);
  return data;
};

export const apiUpdateUserPersonalInfo = async (userPersonalInfo: any) => {
  const { data } = await $authHost.put('user/personal-info', userPersonalInfo);
  return data;
};

export const apiUpdateUserGeneralInfo = async (payload: any) => {
  const { data } = await $authHost.put('user/general-info', payload);
  return data;
};

export const apiUpdateUserImages = async (payload: any) => {
  const { data } = await $authHost.put('user/images', payload);
  return data;
};

export const apiAddImageCaption = async (caption: any, imageId: any) => {
  const { data } = await $authHost.put(`users/images/${imageId}/caption`, { caption: caption });
  return data;
};

export const apiCheckAllProfileVisits = async () => {
  const { data } = await $authHost.put('user/profile-visits');
  return data;
};

export const apiUserFollow = async (userId: string) => {
  const { data } = await $authHost.post(`user/${userId}/follow`);
  return data;
};

export const apiUserUnFollow = async (userId: string) => {
  const { data } = await $authHost.delete(`user/${userId}/follow`);
  return data;
};

export const apiGetUserById = async (id: any) => {
  const { data } = await $host.get(`user/${id}`);
  return data;
};

export const apiSetUserRating = async ({ userId, rating }: any) => {
  const { data } = await $authHost.post(`user/${userId}/rating/${rating}`);
  return data;
};

export const apiGetFavorites = async (queryKey: any) => {
  const { data } = await $authHost.get(`user/all-favorites/${queryKey}`);
  return data;
};

export const apiSendComplaint = async ({ profileId, complaintPayload }: any) => {
  const { data } = await $authHost.post(`user/${profileId}/complaint`, complaintPayload);
  return data;
};

export const apiGetUsers = async (payload: any) => {
  const { data } = await $host.get('users', {
    params: {
      ...(!isNullOrUndefined(payload?.name) && !isEmptyString(payload?.name)
        ? { name: payload?.name }
        : {}),
      ...(!isNullOrUndefined(payload?.age) && !isEmptyString(payload?.age)
        ? { age: payload?.age }
        : {}),
      ...(!isNullOrUndefined(payload?.gender) && !isEmptyString(payload?.gender)
        ? { gender: payload?.gender }
        : {}),
      ...(!isNullOrUndefined(payload?.languages) && !isEmptyArray(payload?.languages)
        ? { languages: payload?.languages }
        : {}),
      ...(!isNullOrUndefined(payload?.countries) && !isEmptyArray(payload?.countries)
        ? { countries: payload?.countries }
        : {}),
      ...(!isNullOrUndefined(payload?.tripTo) && !isEmptyArray(payload?.tripTo)
        ? { tripTo: payload?.tripTo }
        : {}),
      ...(!isNullOrUndefined(payload?.isOnline) ? { isOnline: payload?.isOnline } : {}),
    },
  });
  return data;
};
