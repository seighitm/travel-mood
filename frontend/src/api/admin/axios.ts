import { $authHost } from '../api';

export const apiGetAllComplaints = async (status: string) => {
  const { data } = await $authHost.get(`admin/complaint/${status}`);
  return data;
};

export const apiCloseComplaint = async (complaintId: string | number) => {
  const { data } = await $authHost.put(`admin/complaint/${complaintId}`);
  return data;
};

export const getUsersWithAdminRole = async (
  page: any,
  limit: any,
  search: any,
  sortBy: any,
  order: any
) => {
  const { data } = await $authHost.get('/admin/users', {
    params: {
      page,
      limit,
      ...(search ? { search } : {}),
      ...(sortBy ? { sortBy } : {}),
      ...(order ? { order } : {}),
    },
  });
  return data;
};

export const getArticlesForAdmin = async (
  page: any,
  limit: any,
  search: any,
  sortBy: any,
  order: any
) => {
  const { data } = await $authHost.get('/admin/articles', {
    params: {
      page,
      limit,
      ...(search ? { search } : {}),
      ...(sortBy ? { sortBy } : {}),
      ...(order ? { order } : {}),
    },
  });
  return data;
};

export const getTripsForAdmin = async (
  page: any,
  limit: any,
  search: any,
  sortBy: any,
  order: any
) => {
  const { data } = await $authHost.get('/admin/trips', {
    params: {
      page,
      limit,
      ...(search ? { search } : {}),
      ...(sortBy ? { sortBy } : {}),
      ...(order ? { order } : {}),
    },
  });
  return data;
};

export const apiUserAccountBlock = async ({ userId, expiredBlockDate, reason }: any) => {
  const { data } = await $authHost.put(`user/${userId}/block`, {
    expiredBlockDate: expiredBlockDate,
    reason: reason,
  });
  return data;
};

export const apiUserAccountActivate = async ({ userId }: any) => {
  const { data } = await $authHost.put(`user/${userId}/activate`);
  return data;
};

export const apiSwitchUserRole = async ({ userId }: any) => {
  const { data } = await $authHost.put(`user/${userId}/switch-role`);
  return data;
};
