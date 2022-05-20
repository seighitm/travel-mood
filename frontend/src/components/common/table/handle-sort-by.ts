const handleSortBy = (
  column: any,
  queryPageSortBy: any,
  queryPageOrder: any,
  setPageSortBy: any,
  setPageOrder: any
) =>
  queryPageSortBy === column.id
    ? queryPageOrder === "none"
      ? setPageOrder("asc")
      : queryPageOrder === "asc"
      ? setPageOrder("desc")
      : setPageOrder("none")
    : (setPageSortBy(column.id), setPageOrder("asc"));

export default handleSortBy;
