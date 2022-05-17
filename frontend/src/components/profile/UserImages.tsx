import React, {useState} from 'react';
import {Accordion, Grid, Image, Paper} from '@mantine/core';
import ViewImageModal from './user-images/modals/ViewImageModal';

function UserImages({images}: any) {
  const [openedModalViewImage, setOpenedModalViewImage] = useState(false);
  const [selectedViewImage, setSelectedViewImage] = useState<any>(null);

  return (
    <>
      <ViewImageModal openedModalViewImage={openedModalViewImage}
                      setOpenedModalViewImage={setOpenedModalViewImage}
                      selectedViewImage={selectedViewImage}
      />
      <Paper
        radius={10}
        mt={'md'}
        sx={(theme) => ({
          border: '2px solid ',
          boxShadow: theme.shadows.lg,
          borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
          position: 'relative',
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        })}
      >
        <Accordion>
          <Accordion.Item
            label='Images'
            styles={() => ({
              itemTitle: {margin: '0!important'},
              content: {paddingLeft: 0},
            })}
          >
            <Grid>
              {images?.length != 0 &&
                images.map((image: any) => (
                  <Grid.Col key={image.id}
                            sm={6} md={4} lg={3} xl={3}
                            style={{position: 'relative'}}
                  >
                    <Image
                      style={{cursor: 'pointer'}}
                      radius='md'
                      height={150}
                      onClick={() => {
                        setSelectedViewImage(image.image);
                        setOpenedModalViewImage(true);
                      }}
                      src={`${import.meta.env.VITE_STORE_AWS}${image.image}`}
                    />
                  </Grid.Col>
                ))}
            </Grid>
          </Accordion.Item>
        </Accordion>
      </Paper>
    </>
  );
}

export default UserImages;
