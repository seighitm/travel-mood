import React from 'react';
import {ActionIcon, Grid, Image} from '@mantine/core';
import {X} from '../../common/Icons';

const UploadImagesComponent = React.memo(
  ({oldFiles, newFiles, handlerRemoveOldImage, handlerRemoveNewImage}: any) => {
    return (
      <Grid mb={'md'} mt={'md'} gutter="xs">
        {oldFiles != undefined &&
          oldFiles.map((file: any, index: any) => (
            <Grid.Col
              sx={{position: 'relative'}}
              span={2} key={file.name + '' + index}
            >
              <ActionIcon
                style={{position: 'absolute', zIndex: '1', top: '0', right: '0'}}
                radius="xl"
                variant="filled"
                color="red"
                size={20}
                onClick={() => {
                  if (typeof file == 'string') {
                    handlerRemoveOldImage(file)
                  } else {
                    handlerRemoveOldImage(file.name, file.id);
                  }
                }}
              >
                <X size={15}/>
              </ActionIcon>
              <Image
                radius="md"
                height={60}
                style={{cursor: 'pointer'}}
                alt={`file preview ${index}`}
                src={import.meta.env.VITE_STORE_AWS + (file?.name ?? file)}
              />
            </Grid.Col>
          ))}
        {newFiles.length != 0 &&
          newFiles.map((file: any, index: any) => (
            <Grid.Col
              sx={{position: 'relative'}}
              span={2}
              key={file.name + '' + index}
            >
              <ActionIcon
                onClick={() => handlerRemoveNewImage(file.name)}
                style={{position: 'absolute', zIndex: '1', top: '0', right: '0'}}
                radius="xl"
                variant="filled"
                color="red"
                size={20}
              >
                <X size={15}/>
              </ActionIcon>
              <Image
                radius="md"
                height={60}
                sx={{cursor: 'pointer'}}
                alt={`file preview ${index}`}
                src={URL.createObjectURL(file)}
              />
            </Grid.Col>
          ))}
      </Grid>
    );
  }
);

export default UploadImagesComponent;
