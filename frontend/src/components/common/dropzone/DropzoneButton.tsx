import React, { useRef } from 'react';
import { Text, Group, Button, createStyles, MantineTheme, useMantineTheme } from '@mantine/core';
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE, MIME_TYPES } from '@mantine/dropzone';
import { UploadIcon } from '@modulz/radix-icons';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    marginBottom: 40,
  },

  dropzone: {
    borderWidth: 1,
    paddingBottom: 50,
  },

  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
  },

  control: {
    position: 'absolute',
    width: 250,
    left: 'calc(50% - 125px)',
    bottom: -20,
  },
}));

function getActiveColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][6]
    : status.rejected
    ? theme.colors.red[6]
    : theme.colorScheme === 'dark'
    ? theme.colors.dark[0]
    : theme.black;
}

export function DropzoneButton({ files, setFiles }: any) {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const openRef: any = useRef<() => void>();

  return (
    <div className={classes.wrapper}>
      <Dropzone
        openRef={openRef}
        onDrop={(newFiles: any) => {
          const array: any = [];
          for (let i = 0; i < newFiles.length; i++)
            if (!files.find((file: any) => file.path === newFiles[i].path)) array.push(newFiles[i]);
          setFiles([...files, ...array]);
        }}
        onReject={(files: any) => console.log('rejected files', files)}
        className={classes.dropzone}
        radius="md"
        accept={IMAGE_MIME_TYPE}
        maxSize={3 * 1024 ** 2}
      >
        {(status) => (
          <div style={{ pointerEvents: 'none' }}>
            <Group position="center">
              <UploadIcon color={getActiveColor(status, theme)} />
            </Group>
            <Text
              align="center"
              weight={700}
              size="lg"
              mt="xl"
              sx={{ color: getActiveColor(status, theme) }}
            >
              {status.accepted
                ? 'Drop files here'
                : status.rejected
                ? 'Pdf file less than 30mb'
                : 'Upload resume'}
            </Text>
            <Text align="center" size="sm" mt="xs" color="dimmed">
              Drag&apos;n&apos;drop files here to upload. We can accept only <i>.pdf</i> files that
              are less than 30mb in size.
            </Text>
          </div>
        )}
      </Dropzone>

      <Button
        variant="light"
        color="blue"
        className={classes.control}
        size="md"
        radius="xl"
        onClick={() => openRef.current()}
      >
        Select files
      </Button>
    </div>
  );
}
