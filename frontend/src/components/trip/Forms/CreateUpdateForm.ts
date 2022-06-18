import { POST_TILE_MAX_LENGTH, POST_TILE_MIN_LENGTH } from '../../../utils/constants';
import { isEmptyArray, isEmptyString, isNullOrUndefined } from '../../../utils/primitive-checks';

const CreateUpdateTripForm = {
  initialValues: {
    title: '',
    description: '',
    gender: '',
    date: [],
    languages: [],
    transports: [],
    itinerary: '',
    budget: null,
    isSplitCost: false,
    isAnytime: false,
    maxNrOfPersons: undefined,
  },
  validate: {
    title: (value: any) =>
      value?.trim().length < POST_TILE_MIN_LENGTH || value?.trim().length >= POST_TILE_MAX_LENGTH
        ? `The title must contain a minimum of ${POST_TILE_MIN_LENGTH} and a maximum of ${POST_TILE_MAX_LENGTH} characters!`
        : null,
    description: (value: any) =>
      value.length < POST_TILE_MIN_LENGTH
        ? `Description should have at least ${POST_TILE_MIN_LENGTH} letters`
        : null,
    languages: (value: any) => (isEmptyArray(value) ? 'Add at least one language!' : null),
    transports: (value: any) => (isEmptyArray(value) ? 'Add at least one transport!' : null),
    budget: (value: any) => (!isNullOrUndefined(value) && value < 0 ? 'Invalid budget!' : null),
    itinerary: (value: any) =>
      isEmptyString(value) ? 'You did not specify the type of itinerary!' : null,
    maxNrOfPersons: (value: any) =>
      isNullOrUndefined(value) ? 'You did not specify max number of persons!' : null,
  },
};

export default CreateUpdateTripForm;
