import {Group, Text, TypographyStylesProvider, useMantineTheme} from '@mantine/core';
import {Image, Upload, X} from '../../../assets/Icons';
import {Dropzone, DropzoneStatus, IMAGE_MIME_TYPE, MIME_TYPES} from '@mantine/dropzone';
import React from 'react';
import {showNotification} from "@mantine/notifications";

function ImageUploadIcon({status, ...props}: React.ComponentProps<any> & { status: DropzoneStatus }) {
  if (status.accepted) return <Upload size={30} {...props} />;
  if (status.rejected) return <X size={30} {...props} />;
  return <Image size={50} {...props} />;
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

const DropzoneArea = React.memo(({titleImage, files, setFiles}: any) => {
  const theme = useMantineTheme();
  return (
    <TypographyStylesProvider>
      <Dropzone
        onDrop={(newFiles: any) => {
          const array: any = [];
          for (let i = 0; i < newFiles.length; i++)
            if (!files.find((file: any) => file.path === newFiles[i].path)) array.push(newFiles[i]);
          setFiles([...files, ...array.filter((image: any) => image.name != titleImage?.name)]);
        }}
        onReject={(files: any) => {
          showNotification({
            title: 'Image is invalid!',
            message: '',
            color: 'red',
          });
          console.log('rejected files', files)
        }}
        maxSize={3 * 1024 ** 2}
        accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.svg]}
      >
        {(status: any) => (
          <Group position="center" spacing="xl" style={{minHeight: 80, pointerEvents: 'none'}}>
            <ImageUploadIcon
              status={status}
              style={{width: 80, height: 80, color: getIconColor(status, theme)}}
            />
            <div>
              <Text size="xl" inline>
                Drag images here or click to select files
              </Text>
              <Text size="sm" color="dimmed" inline mt={7}>
                Attach as many files as you like, each file should not exceed 5mb
              </Text>
            </div>
          </Group>
        )}
      </Dropzone>
    </TypographyStylesProvider>
  );
});

export default DropzoneArea;
