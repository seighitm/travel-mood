import { ChevronDown, ChevronUp } from '../Icons';

const SortingIcon = (column: any, queryPageSortBy: any, queryPageOrder: any) => (
  <>
    {column === queryPageSortBy && queryPageOrder === 'asc' ? (
      <ChevronDown size={16} />
    ) : column === queryPageSortBy && queryPageOrder === 'desc' ? (
      <ChevronUp size={16} />
    ) : null}
  </>
);

export default SortingIcon;
