export const getFullUserName = (user: any) => {
  return `${user?.lastName} ${user?.firstName}`
}

export const getNrOfDayByDateInterval = ({dateFrom, dateTo}: { dateFrom: string | Date, dateTo: string | Date }) => {
  return Math.abs(new Date(dateFrom).getTime() - new Date(dateTo).getTime()) / (1000 * 3600 * 24)
}

export const calculateAge = (birthday: string) => {
  return Math.abs(new Date(Date.now() - new Date(birthday).getTime()).getUTCFullYear() - 1970);
}
