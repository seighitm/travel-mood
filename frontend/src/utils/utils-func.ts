import {ROLE} from "../types/enums";
import {useLocation} from "react-router-dom";
import {isEmptyString, isNullOrUndefined} from "./primitive-checks";

export const getFullUserName = (user: any) => {
  return `${user?.lastName} ${user?.firstName}`
}

export const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
}

export const getNrOfDayByDateInterval = ({dateFrom, dateTo}: { dateFrom: string | Date, dateTo: string | Date }) => {
  return Math.abs(new Date(dateFrom).getTime() - new Date(dateTo).getTime()) / (1000 * 3600 * 24)
}

export const calculateAge = (birthday: string) => {
  return Math.abs(new Date(Date.now() - new Date(birthday).getTime()).getUTCFullYear() - 1970);
}

export const isValidEmail = (email: string) => {
  if (isNullOrUndefined(email) || isEmptyString(email))
    return false
  return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
}

export const userPicture = (user: any) => {
  return (user?.picture?.image != "null" && user?.picture?.image != null)
    ? `${import.meta.env.VITE_STORE_AWS}${user?.picture?.image}`
    : `${import.meta.env.VITE_API_URL}uploads/site/${(user?.gender?.gender === 'FEMALE' ? 'woman.png' : 'man.png')}`
};

export const creteAuthorShortName = (name: string) => {
  let shortName: string = '';
  if (name && name?.length != 0) {
    const shortAuthorName = name.toUpperCase().split(' ');
    for (let i = 0; i < shortAuthorName.length; i++) {
      if (i == 2) break;
      shortName += shortAuthorName[i][0];
    }
    return shortName;
  }
  return '';
};

export const articleImage = (article: any) => {
  return article.primaryImage != null && article.primaryImage != 'null'
    ? `${import.meta.env.VITE_STORE_AWS}${article.primaryImage}`
    : `${import.meta.env.VITE_API_URL}uploads/site/article-picture.jpg`
};

export const cutString: any = (message: string, length: number = 15) => {
  if (message) return message?.slice(0, length) + (message?.length >= length ? '...' : '')
}

export const dateFormattedToIsoString: any = (date: Date | any) => {
  return new Date(date).toISOString().split('T')[0].split('-').join('.')
}

export const dateFullFormattedToIsoString: any = (date: Date | any) => {
  const startDate = new Date(date)
  startDate.setHours(startDate.getHours() + 3)
  return new Date(date).toISOString().split('T')[0].split('-').join('.')
    + ' | '
    + new Date(startDate).toISOString().split('T')[1].split('.')[0]
}

export const customNavigation = (userRole: string, navigate: any, url: any) => {
  return navigate(userRole == ROLE.ADMIN ? '/admin' + url : url)
}

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
