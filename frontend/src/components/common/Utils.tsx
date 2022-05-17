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

export const userPicture = (user: any) => {
  return (user?.picture?.image != "null" && user?.picture?.image != null)
    ? `${import.meta.env.VITE_STORE_AWS}${user?.picture?.image}`
    : `${import.meta.env.VITE_API_URL}uploads/site/${(user?.sex === 'f' ? 'woman.png' : 'man.png')}`
};

export const articleImage = (article: any) => {
  return article.primaryImage != null && article.primaryImage != 'null'
    ? `${import.meta.env.VITE_STORE_AWS}${article.primaryImage}`
    : 'https://previews.123rf.com/images/topvectors/topvectors1506/topvectors150600015/40658771-travel-vacation-flat-design-set-vector-concept-illustration-travel-banner-.jpg'
};

export const calculateAge = (birthday: string) => {
  return Math.abs(new Date(Date.now() - new Date(birthday).getTime()).getUTCFullYear() - 1970);
};

export const cutString: any = (message: string, length: number = 15) => {
  if (message) return message?.slice(0, length) + (message?.length >= length ? '...' : '')
}

export const dateFormatedToIsoString: any = (date: Date | any) => {
  console.log(date)
  return new Date(date).toISOString().split('T')[0]
}
