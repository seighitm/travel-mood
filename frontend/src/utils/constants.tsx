import { News, PlaneDeparture, Users, Map } from '../components/common/Icons';

export const USER_HEADER_LINKS = [
  {
    link: '/articles',
    label: 'Articles',
    icon: News,
  },
  {
    link: '/trips',
    label: 'Trips',
    icon: PlaneDeparture,
  },
  {
    link: '/users',
    label: 'Users',
    icon: Users,
  },
  {
    link: '/map',
    label: 'Map',
    icon: Map,
  },
];

export const SM_ICON_SIZE: number = 12
export const MD_ICON_SIZE: number = 15
export const LG_ICON_SIZE: number = 18
export const XL_ICON_SIZE: number = 20

export const POST_TILE_MIN_LENGTH = 3
export const POST_TILE_MAX_LENGTH = 50

export const BUDGET = [
  {value: '0-150', label: '$0 - 150$'},
  {value: '150-500', label: '$150 - 500$'},
  {value: '500-1000', label: '$500 - 1000$'},
  {value: '1000-1500', label: '$1000 - 1500$'},
  {value: '1500-2000', label: '$1500$ - 2000$'},
  {value: '2000+', label: '2000$ +'},
]

export const TRIP_GENDER_MALE = [
  {value: 'MALE', label: 'Male'},
  {value: 'FEMALE', label: 'Female'},
  {value: 'ANY', label: 'Any'}
]

export const TRIP_GENDER_FEMALE = [
  {value: 'MALE', label: 'Male'},
  {value: 'FEMALE', label: 'Female'},
  {value: 'ANY', label: 'Any'}
]

export const TRIP_GENDER = [
  {value: 'MALE', label: 'Male'},
  {value: 'FEMALE', label: 'Female'},
  {value: 'MALE', label: 'Male'},
  {value: 'FEMALE', label: 'Female'},
  {value: 'ANY', label: 'Any'}
]

export const USER_GENDER = [
  {value: 'FEMALE', label: 'Female'},
  {value: 'MALE', label: 'Male'},
  {value: 'OTHER', label: 'Other'},
]

export const RELATIONSHIP_STATUS = [
  {value: 'SINGLE', label: 'Single'},
  {value: 'IN_RELATION', label: 'In a relationship'},
]

export const ITINERARY = [
  {value: 'FIXED', label: 'Fixed'},
  {value: 'FLEXIBLE', label: 'Flexible'},
]

export const SOCKET_ENDPOINT = import.meta.env.VITE_API_URL;
