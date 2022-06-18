import React, { useEffect, useState } from 'react';
import { createStyles, ScrollArea, Table } from '@mantine/core';
import { CustomLoader } from '../../common/CustomLoader';
import { useGetCountries } from '../../../api/info/queries';
import { isEmptyArray, isNullOrUndefined } from '../../../utils/primitive-checks';

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',
    zIndex: 1,
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
      }`,
    },
  },
  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

function CountriesPage() {
  const { classes, cx } = useStyles();
  const [rows, setRows] = useState<any>([]);
  const [scrolled, setScrolled] = useState(false);

  const { data: dbCountries, isLoading: isLoadingGetCountries } = useGetCountries({
    isEnabled: true,
  });

  useEffect(() => {
    setRows(
      dbCountries?.map((element: any) => {
        return (
          <tr key={element.id}>
            <td>{element?.id}</td>
            <td>{element?.name}</td>
            <td>{element?.code}</td>
            <td>{element?._count.users}</td>
            <td>{element?._count.articles}</td>
            <td>{element?._count.trips}</td>
            <td>{element?._count.interestedInBy}</td>
            <td>{element?._count.visitedBy}</td>
          </tr>
        );
      })
    );
  }, [dbCountries]);

  if (isLoadingGetCountries) return <CustomLoader />;

  return (
    <div>
      {!isNullOrUndefined(dbCountries) && !isEmptyArray(dbCountries) && !isEmptyArray(rows) ? (
        <CustomLoader />
      ) : (
        <ScrollArea
          sx={{ height: '85vh' }}
          onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        >
          <Table
            sx={() => ({
              minWidth: 700,
              tr: { textAlign: 'center' },
            })}
            verticalSpacing="xs"
            striped
            highlightOnHover
          >
            <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
              <tr>
                <th style={{ textAlign: 'center' }}>ID</th>
                <th style={{ textAlign: 'center' }}>Country</th>
                <th style={{ textAlign: 'center' }}>Code</th>
                <th style={{ textAlign: 'center' }}>Nr of users</th>
                <th style={{ textAlign: 'center' }}>Nr. of articles</th>
                <th style={{ textAlign: 'center' }}>Nr. of trips</th>
                <th style={{ textAlign: 'center' }}>Interested by</th>
                <th style={{ textAlign: 'center' }}>Visited by</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
}

export default CountriesPage;
