import {POST_TILE_MAX_LENGTH, POST_TILE_MIN_LENGTH} from '../../../utils/constants';

const CreateUpdateForm = {
  initialValues: {
    title: '',
    tags: [],
    countries: [],
  },
  title: (value: any) =>
    value?.trim().length < POST_TILE_MIN_LENGTH || value?.trim().length >= POST_TILE_MAX_LENGTH
      ? `The title must contain a minimum of ${POST_TILE_MIN_LENGTH} and a maximum of ${POST_TILE_MAX_LENGTH} characters!`
      : null,
};
export default CreateUpdateForm;
