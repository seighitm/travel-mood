import { News, PlaneDeparture, Users, Map } from '../assets/Icons';

export const HEADER_LINKS = [
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

export const SOCKET_ENDPOINT = import.meta.env.VITE_API_URL;
