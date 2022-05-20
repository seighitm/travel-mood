import {ReactNode} from "react";

interface Icon {
  color?: string,
  fill?: string,
  size?: number,
  className?: any,
  children?: ReactNode
}

const IconWrapper = ({color = 'currentColor', fill = 'none', size = 12, className = {}, children}: Icon) => {
  return <svg xmlns='http://www.w3.org/2000/svg'
              width={size}
              height={size}
              stroke={color}
              fill={fill}
              viewBox={`${0} ${0} 24 24`}
              strokeWidth='2'
              strokeLinejoin='round'
              strokeLinecap='round'
              className={className}
  >
    {children}
  </svg>;
}

export const Heart = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572'></path>
    </>
  </IconWrapper>
};

export const Adjustments = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <circle cx={6} cy={10} r={2}></circle>
      <line x1={6} y1={4} x2={6} y2={8}></line>
      <line x1={6} y1={12} x2={6} y2={20}></line>
      <circle cx={12} cy={16} r={2}></circle>
      <line x1={12} y1={4} x2={12} y2={14}></line>
      <line x1={12} y1={18} x2={12} y2={20}></line>
      <circle cx={18} cy={7} r={2}></circle>
      <line x1={18} y1={4} x2={18} y2={5}></line>
      <line x1={18} y1={9} x2={18} y2={20}></line>
    </>
  </IconWrapper>
};

export const Bulb = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7'></path>
      <path d='M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3'></path>
      <line x1='9.7' y1={17} x2='14.3' y2={17}></line>
    </>
  </IconWrapper>
};

export const Check = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M5 12l5 5l10 -10'></path>
    </>
  </IconWrapper>
};

export const CirclePlus = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <circle cx={12} cy={12} r={9}></circle>
      <line x1={9} y1={12} x2={15} y2={12}></line>
      <line x1={12} y1={9} x2={12} y2={15}></line>
    </>
  </IconWrapper>
};

export const Checkbox = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <polyline points='9 11 12 14 20 6'></polyline>
      <path d='M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9'></path>
    </>
  </IconWrapper>
};

export const Compass = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <polyline points='8 16 10 10 16 8 14 14 8 16'></polyline>
      <circle cx={12} cy={12} r={9}></circle>
      <line x1={12} y1={3} x2={12} y2={5}></line>
      <line x1={12} y1={19} x2={12} y2={21}></line>
      <line x1={3} y1={12} x2={5} y2={12}></line>
      <line x1={19} y1={12} x2={21} y2={12}></line>
    </>
  </IconWrapper>
};

export const Directions = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill={fill}></path>
      <path d='M12 21v-4'></path>
      <path d='M12 13v-4'></path>
      <path d='M12 5v-2'></path>
      <path d='M10 21h4'></path>
      <path d='M8 5v4h11l2 -2l-2 -2z'></path>
      <path d='M14 13v4h-8l-2 -2l2 -2z'></path>
    </>
  </IconWrapper>
};

export const Eye = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <circle cx={12} cy={12} r={2}></circle>
      <path d='M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7'></path>
    </>
  </IconWrapper>
};

export const Logout = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2'></path>
      <path d='M7 12h14l-3 -3m0 6l3 -3'></path>
    </>
  </IconWrapper>
};

export const Pencil = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4'></path>
      <line x1='13.5' y1='6.5' x2='17.5' y2='10.5'></line>
    </>
  </IconWrapper>
};

export const Sun = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <circle cx={12} cy={12} r={4}></circle>
      <path d='M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7'></path>
    </>
  </IconWrapper>
};

export const MoonStars = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z'></path>
      <path d='M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2'></path>
      <path d='M19 11h2m-1 -1v2'></path>
    </>
  </IconWrapper>
};


export const Plane = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3z'></path>
    </>
  </IconWrapper>
};

export const Selector = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <polyline points='8 9 12 5 16 9'></polyline>
      <polyline points='16 15 12 19 8 15'></polyline>
    </>
  </IconWrapper>
};

export const Settings = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path
        d='M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z'></path>
      <circle cx={12} cy={12} r={3}></circle>
    </>
  </IconWrapper>
};

export const User = ({color = 'currentColor', fill = 'none', size = 12, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <circle cx={12} cy={7} r={4}></circle>
      <path d='M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2'></path>
    </>
  </IconWrapper>
};

export const ChevronDown = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <polyline points='6 9 12 15 18 9'></polyline>
    </>
  </IconWrapper>
};

export const ChevronLeft = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <polyline points="15 6 9 12 15 18"/>
    </>
  </IconWrapper>
};

export const ChevronUp = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <polyline points="6 15 12 9 18 15"/>
    </>
  </IconWrapper>
};

export const Search = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <circle cx={10} cy={10} r={7}></circle>
      <line x1={21} y1={21} x2={15} y2={15}></line>
    </>
  </IconWrapper>
};

export const ArrowNarrowDown = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <line x1={12} y1={5} x2={12} y2={19}></line>
      <line x1={16} y1={15} x2={12} y2={19}></line>
      <line x1={8} y1={15} x2={12} y2={19}></line>
    </>
  </IconWrapper>
};

export const Clipboard = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
      <rect x={9} y={3} width={6} height={4} rx={2}></rect>
    </>
  </IconWrapper>
};

export const Gps = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <circle cx={12} cy={12} r={9}></circle>
      <path d="M12 17l-1 -4l-4 -1l9 -4z"></path>
    </>
  </IconWrapper>
};

export const Discount = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <line x1={9} y1={15} x2={15} y2={9}></line>
      <circle cx="9.5" cy="9.5" r=".5" fill="currentColor"></circle>
      <circle cx="14.5" cy="14.5" r=".5" fill="currentColor"></circle>
      <circle cx={12} cy={12} r={9}></circle>
    </>
  </IconWrapper>
};


export const ArrowNarrowUp = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <line x1={12} y1={5} x2={12} y2={19}></line>
      <line x1={16} y1={9} x2={12} y2={5}></line>
      <line x1={8} y1={9} x2={12} y2={5}></line>
    </>
  </IconWrapper>
};

export const Image = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <line x1={15} y1={8} x2="15.01" y2={8}></line>
      <rect x={4} y={4} width={16} height={16} rx={3}></rect>
      <path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5"></path>
      <path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2"></path>
    </>
  </IconWrapper>
};

export const Trash = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <line x1={4} y1={7} x2={20} y2={7}></line>
      <line x1={10} y1={11} x2={10} y2={17}></line>
      <line x1={14} y1={11} x2={14} y2={17}></line>
      <path d='M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12'></path>
      <path d='M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3'></path>
    </>
  </IconWrapper>
};


export const X = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <line x1={18} y1={6} x2={6} y2={18}></line>
      <line x1={6} y1={6} x2={18} y2={18}></line>
    </>
  </IconWrapper>
};

export const Bookmark = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M9 4h6a2 2 0 0 1 2 2v14l-5 -3l-5 3v-14a2 2 0 0 1 2 -2'></path>
    </>
  </IconWrapper>
};

export const Share = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <circle cx={6} cy={12} r={3}></circle>
      <circle cx={18} cy={6} r={3}></circle>
      <circle cx={18} cy={18} r={3}></circle>
      <line x1='8.7' y1='10.7' x2='15.3' y2='7.3'></line>
      <line x1='8.7' y1='13.3' x2='15.3' y2='16.7'></line>
    </>
  </IconWrapper>
};

export const ArrowUp = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <line x1={12} y1={5} x2={12} y2={19}></line>
      <line x1={18} y1={11} x2={12} y2={5}></line>
      <line x1={6} y1={11} x2={12} y2={5}></line>
    </>
  </IconWrapper>
};

export const ArrowDown = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <line x1={12} y1={5} x2={12} y2={19}></line>
      <line x1={18} y1={13} x2={12} y2={19}></line>
      <line x1={6} y1={13} x2={12} y2={19}></line>
    </>
  </IconWrapper>
};

export const DeviceFloppy = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2'></path>
      <circle cx={12} cy={14} r={2}></circle>
      <polyline points='14 4 14 8 8 8 8 4'></polyline>
    </>
  </IconWrapper>
};

export const Language = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M4 5h7'></path>
      <path d='M9 3v2c0 4.418 -2.239 8 -5 8'></path>
      <path d='M5 9c-.003 2.144 2.952 3.908 6.7 4'></path>
      <path d='M12 20l4 -9l4 9'></path>
      <path d='M19.1 18h-6.2'></path>
    </>
  </IconWrapper>
};

export const CalendarEvent = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <rect x={4} y={5} width={16} height={16} rx={2}></rect>
      <line x1={16} y1={3} x2={16} y2={7}></line>
      <line x1={8} y1={3} x2={8} y2={7}></line>
      <line x1={4} y1={11} x2={20} y2={11}></line>
      <rect x={8} y={15} width={2} height={2}></rect>
    </>
  </IconWrapper>
};

export const World = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <circle cx={12} cy={12} r={9}></circle>
      <line x1='3.6' y1={9} x2='20.4' y2={9}></line>
      <line x1='3.6' y1={15} x2='20.4' y2={15}></line>
      <path d='M11.5 3a17 17 0 0 0 0 18'></path>
      <path d='M12.5 3a17 17 0 0 1 0 18'></path>
    </>
  </IconWrapper>
};

export const ChevronRight = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <polyline points='9 6 15 12 9 18'></polyline>
    </>
  </IconWrapper>
};

export const News = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path
        d='M16 6h3a1 1 0 0 1 1 1v11a2 2 0 0 1 -4 0v-13a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1v12a3 3 0 0 0 3 3h11'></path>
      <line x1={8} y1={8} x2={12} y2={8}></line>
      <line x1={8} y1={12} x2={12} y2={12}></line>
      <line x1={8} y1={16} x2={12} y2={16}></line>
    </>
  </IconWrapper>
};

export const PlaneDeparture = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M15 12h5a2 2 0 0 1 0 4h-15l-3 -6h3l2 2h3l-2 -7h3z' transform='rotate(-15 12 12) translate(0 -1)'></path>
      <line x1={3} y1={21} x2={21} y2={21}></line>
    </>
  </IconWrapper>
};

export const Users = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <circle cx={9} cy={7} r={4}></circle>
      <path d='M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2'></path>
      <path d='M16 3.13a4 4 0 0 1 0 7.75'></path>
      <path d='M21 21v-2a4 4 0 0 0 -3 -3.85'></path>
    </>
  </IconWrapper>
};

export const Send = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <line x1={10} y1={14} x2={21} y2={3}></line>
      <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5"></path>
    </>
  </IconWrapper>
};

export const InfoCircle = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <circle cx={12} cy={12} r={9}></circle>
      <line x1={12} y1={8} x2="12.01" y2={8}></line>
      <polyline points="11 12 12 12 12 16 13 16"></polyline>
    </>
  </IconWrapper>
};

export const Map = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <polyline points='3 7 9 4 15 7 21 4 21 17 15 20 9 17 3 20 3 7'></polyline>
      <line x1={9} y1={4} x2={9} y2={17}></line>
      <line x1={15} y1={7} x2={15} y2={20}></line>
    </>
  </IconWrapper>
};

export const Location = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5'></path>
    </>
  </IconWrapper>
};

export const ArrowNarrowLeft = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <line x1={5} y1={12} x2={19} y2={12}></line>
      <line x1={5} y1={12} x2={9} y2={16}></line>
      <line x1={5} y1={12} x2={9} y2={8}></line>
    </>
  </IconWrapper>
};

export const ArrowBackUp = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1'></path>
    </>
  </IconWrapper>
};

export const Star = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path
        d='M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z'></path>
    </>
  </IconWrapper>
};

export const Paperclip = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5'></path>
    </>
  </IconWrapper>
};

export const Mailbox = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M10 21v-6.5a3.5 3.5 0 0 0 -7 0v6.5h18v-6a4 4 0 0 0 -4 -4h-10.5'></path>
      <path d='M12 11v-8h4l2 2l-2 2h-4'></path>
      <path d='M6 15h1'></path>
    </>
  </IconWrapper>
};

export const MessageDots = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4'></path>
      <line x1={12} y1={11} x2={12} y2='11.01'></line>
      <line x1={8} y1={11} x2={8} y2='11.01'></line>
      <line x1={16} y1={11} x2={16} y2='11.01'></line>
    </>
  </IconWrapper>
};

export const FileAlert = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
      <line x1={12} y1={17} x2="12.01" y2={17}></line>
      <line x1={12} y1={11} x2={12} y2={14}></line>
    </>
  </IconWrapper>
};

export const Circle = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <circle cx={12} cy={12} r={9}></circle>
    </>
  </IconWrapper>
};

export const Clock = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <circle cx={12} cy={12} r={9}></circle>
      <polyline points='12 7 12 12 15 15'></polyline>
    </>
  </IconWrapper>
};

export const Flag = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <line x1={5} y1={5} x2={5} y2={21}></line>
      <line x1={19} y1={5} x2={19} y2={14}></line>
      <path d='M5 5a5 5 0 0 1 7 0a5 5 0 0 0 7 0'></path>
      <path d='M5 14a5 5 0 0 1 7 0a5 5 0 0 0 7 0'></path>
    </>
  </IconWrapper>
};

export const Lock = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <rect x={5} y={11} width={14} height={10} rx={2}></rect>
      <circle cx={12} cy={16} r={1}></circle>
      <path d='M8 11v-4a4 4 0 0 1 8 0v4'></path>
    </>
  </IconWrapper>
};

export const At = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <circle cx={12} cy={12} r={4}></circle>
      <path d='M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28'></path>
    </>
  </IconWrapper>
};

export const Message = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4'></path>
      <line x1={8} y1={9} x2={16} y2={9}></line>
      <line x1={8} y1={13} x2={14} y2={13}></line>
    </>
  </IconWrapper>
};

export const ArrowNarrowRight = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <line x1={5} y1={12} x2={19} y2={12}></line>
      <line x1={15} y1={16} x2={19} y2={12}></line>
      <line x1={15} y1={8} x2={19} y2={12}></line>
    </>
  </IconWrapper>
};

export const Mail = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <rect x={3} y={5} width={18} height={14} rx={2}></rect>
      <polyline points='3 7 12 13 21 7'></polyline>
    </>
  </IconWrapper>
};

export const Photo = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <line x1={15} y1={8} x2='15.01' y2={8}></line>
      <rect x={4} y={4} width={16} height={16} rx={3}></rect>
      <path d='M4 15l4 -4a3 5 0 0 1 3 0l5 5'></path>
      <path d='M14 14l1 -1a3 5 0 0 1 3 0l2 2'></path>
    </>
  </IconWrapper>
};

export const Upload = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2'></path>
      <polyline points='7 9 12 4 17 9'></polyline>
      <line x1={12} y1={4} x2={12} y2={16}></line>
    </>
  </IconWrapper>
};

export const Key = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <circle cx={8} cy={15} r={4}></circle>
      <line x1='10.85' y1='12.15' x2={19} y2={4}></line>
      <line x1={18} y1={5} x2={20} y2={7}></line>
      <line x1={15} y1={8} x2={17} y2={10}></line>
    </>
  </IconWrapper>
};

export const MapPin = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <circle cx={12} cy={11} r={3}></circle>
      <path d='M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z'></path>
    </>
  </IconWrapper>
};

export const BrandTwitter = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path
        d='M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z'></path>
    </>
  </IconWrapper>
};

export const BrandFacebook = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"></path>
    </>
  </IconWrapper>
};

export const CurrencyDollar = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M16.7 8a3 3 0 0 0 -2.7 -2h-4a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-4a3 3 0 0 1 -2.7 -2"></path>
      <path d="M12 3v3m0 12v3"></path>
    </>
  </IconWrapper>
};

export const GenderBigender = ({color, fill, size, className}: Icon) => {
  return <IconWrapper color={color} fill={fill} size={size} className={className}>
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <circle cx={11} cy={11} r={4}></circle>
      <path d="M19 3l-5 5"></path>
      <path d="M15 3h4v4"></path>
      <path d="M11 16v6"></path>
      <path d="M8 19h6"></path>
    </>
  </IconWrapper>
};
