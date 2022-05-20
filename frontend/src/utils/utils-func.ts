export const getFullUserName = (user: any) => {
  return `${user?.lastName} ${user?.firstName}`
}

export const getNrOfDayByDateInterval = ({dateFrom, dateTo}: { dateFrom: string | Date, dateTo: string | Date }) => {
  return Math.abs(new Date(dateFrom).getTime() - new Date(dateTo).getTime()) / (1000 * 3600 * 24)
}

export const calculateAge = (birthday: string) => {
  return Math.abs(new Date(Date.now() - new Date(birthday).getTime()).getUTCFullYear() - 1970);
}

export const isValidEmail = (email: string) => {
  return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
}
