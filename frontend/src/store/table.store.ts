import create from 'zustand';
import {StateProps} from '../types/type';

const tableStore = create<StateProps | any>((set) => ({
  queryPageIndex: 1,
  queryPageSize: 20,
  queryPageFilter: '',
  queryPageSortBy: [],
  queryPageOrder: 'none',
  setPageIndex: (queryPageIndex: any) => {
    set(() => ({queryPageIndex: queryPageIndex}));
  },
  setPageSize: (queryPageSize: any) => {
    set(() => ({queryPageSize: queryPageSize}));
  },
  setPageFilter: (queryPageFilter: any) => {
    set(() => ({queryPageFilter: queryPageFilter}));
  },
  setPageSortBy: (queryPageSortBy: any) => {
    set(() => ({queryPageSortBy: queryPageSortBy}));
  },
  setPageOrder: (queryPageOrder: any) => {
    set(() => ({queryPageOrder: queryPageOrder}));
  },
}));

export default tableStore;
