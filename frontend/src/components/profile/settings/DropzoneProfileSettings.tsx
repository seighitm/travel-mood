import { Group, Stack, Text, TypographyStylesProvider, useMantineTheme } from '@mantine/core';
import { Photo, Upload, X } from '../../../assets/Icons';
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import React from 'react';

function ImageUploadIcon({
                           status,
                           ...props
                         }: React.ComponentProps<any> & { status: DropzoneStatus }) {
  if (status.accepted) {
    return <Upload {...props} />;
  }

  if (status.rejected) {
    return <X {...props} />;
  }

  return <Photo {...props} />;
}

function getIconColor(status: any, theme: any) {
  return status.accepted
    ? theme.colors[theme.primaryColor][6]
    : status.rejected
      ? theme.colors.red[6]
      : theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.black;
}

const DropzoneProfileSettings = ({ files, setFiles }: any) => {
  const theme = useMantineTheme();
  return (
    <TypographyStylesProvider>
      <Dropzone
        mb={'xl'}
        onDrop={(newFiles: any) => {
          const array: any = [];
          for (let i = 0; i < newFiles.length; i++)
            if (!files.find((file: any) => file.path === newFiles[i].path)) array.push(newFiles[i]);
          setFiles([...files, ...array]);
        }}
        onReject={(files: any) => console.log('rejected files', files)}
        maxSize={3 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        styles={() => ({
          root: {
            height: '150px',
          },
        })}
      >
        {(status: any) => (
          <Group position="center" spacing="xl" style={{ minHeight: 120, pointerEvents: 'none' }}>
            {/*<Group position='center' spacing='xl' style={{ pointerEvents: 'none' }}>*/}
          {/*<Stack justify={'center'} align={'center'}>*/}
              <ImageUploadIcon
                status={status}
                style={{ width: 80, height: 80, color: getIconColor(status, theme) }}
              />
            <div>
              <Text size="md" inline>
                Drag images here or click to select files
              </Text>
            </div>
          {/*</Stack>*/}
            </Group>
        )}
      </Dropzone>
    </TypographyStylesProvider>
  );
};

export default DropzoneProfileSettings;
