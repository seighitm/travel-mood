import React, { useEffect, useState } from 'react';
import { createStyles, ScrollArea, Table } from '@mantine/core';
import { CustomLoader } from '../../common/CustomLoader';
import { useGetLanguages } from '../../../api/info/queries';
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

function LanguagesPage() {
  const { classes, cx } = useStyles();
  const [rows, setRows] = useState<any>([]);
  const [scrolled, setScrolled] = useState(false);
  const { data: dataLanguages, isLoading: isLoadingGetLanguages } = useGetLanguages({});

  useEffect(() => {
    setRows(
      dataLanguages?.map((element: any) => {
        return (
          <tr key={element.id}>
            <td>{element?.id}</td>
            <td>{element?.name}</td>
            <td>{element?.tripCount}</td>
            <td>{element?.userCount}</td>
          </tr>
        );
      })
    );
  }, [dataLanguages]);

  if (isLoadingGetLanguages) return <CustomLoader />;

  return (
    <div>
      {!isNullOrUndefined(dataLanguages) && !isEmptyArray(dataLanguages) && !isEmptyArray(rows) ? (
        <CustomLoader />
      ) : (
        <ScrollArea
          sx={{ height: '85vh' }}
          onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        >
          <Table
            verticalSpacing="xs"
            striped
            highlightOnHover
            sx={() => ({
              minWidth: 700,
              tr: {
                textAlign: 'center',
              },
            })}
          >
            <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
              <tr>
                <th style={{ textAlign: 'center' }}>Id</th>
                <th style={{ textAlign: 'center' }}>Language</th>
                <th style={{ textAlign: 'center' }}>Nr. of trips</th>
                <th style={{ textAlign: 'center' }}>Nr. of users</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
}

export default LanguagesPage;
