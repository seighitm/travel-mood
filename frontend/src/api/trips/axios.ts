import { isEmptyString, isNullOrUndefined } from '../../utils/primitive-checks';
import { $authHost } from '../api';

export const apiUnFavoriteTrip = async ({ id }: { id: any }) => {
  const { data } = await $authHost.delete(`trip/${id.id}/favorite`);
  return data;
};

export const apiFavoriteTrip = async ({ id }: { id: any }) => {
  const { data } = await $authHost.put(`trip/${id.id}/favorite`);
  return data;
};

export const apiGetOneTrip = async (id: any) => {
  const { data } = await $authHost.get(`trip-one/${id}`);
  return data;
};

export const apiUpdateTrip = async ({
  tripId,
  tripPayload,
}: {
  tripId: string;
  tripPayload: any;
}) => {
  const { data } = await $authHost.put('trip/' + tripId, tripPayload);
  return data;
};

export const apiCreateTrip = async ({ tripPayload }: { tripPayload: any }) => {
  const { data } = await $authHost.post('trip', tripPayload);
  return data;
};

export const apiDeleteTrip = async ({ id }: { id: string | number | undefined }) => {
  const { data } = await $authHost.delete(`trip/${id}`);
  return data;
};

export const apiGetTrips = async ({
  destinations,
  gender,
  languages,
  date,
  budget,
  page,
  title,
}: any) => {
  const { data } = await $authHost.get('trips', {
    params: {
      ...(!isNullOrUndefined(page) ? { page: page } : {}),
      ...(!isNullOrUndefined(title) && !isEmptyString(title) ? { title: title } : {}),
      ...(!isNullOrUndefined(destinations) && !isEmptyString(destinations)
        ? { destinations: destinations }
        : {}),
      ...(!isNullOrUndefined(gender) ? { gender: gender } : {}),
      ...(!isNullOrUndefined(languages) && !isEmptyString(languages)
        ? { languages: languages }
        : {}),
      ...(!isNullOrUndefined(budget) ? { budget: budget } : {}),
      ...(!isNullOrUndefined(date) && date?.length == 2 ? { date: date } : {}),
    },
  });
  return data;
};

export const apiSwitchTripHiddenStatus = async (tripId: any) => {
  const { data } = await $authHost.put(`trip/${tripId}/hide/`);
  return data;
};
