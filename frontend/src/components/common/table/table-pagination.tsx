import { Group, Pagination } from '@mantine/core';
import React from 'react';

const TablePagination = ({ page, onChange, total }: any) => {
  return (
    <Group position="center">
      <Pagination page={page} onChange={(pageIndex) => onChange(pageIndex)} total={total} />
    </Group>
  );
};

export default TablePagination;
