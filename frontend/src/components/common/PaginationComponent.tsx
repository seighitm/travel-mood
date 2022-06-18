import React from 'react';
import { Pagination } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useWindowScroll } from '@mantine/hooks';

function PaginationComponent({ items, setActivePage, activePage, to }: any) {
  const navigate = useNavigate();
  const [, scrollTo] = useWindowScroll();

  return (
    <Pagination
      pb={'xs'}
      sx={{ justifyContent: 'center' }}
      total={Math.ceil(items / 12)}
      page={activePage}
      onChange={(e: any) => {
        navigate(to + '?page=' + e.toString());
        setActivePage(e);
        scrollTo({ y: 0 });
      }}
    />
  );
}

export default PaginationComponent;
