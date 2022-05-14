import React from 'react';
import {ActionIcon, Container, createStyles, Grid, Image} from '@mantine/core';
import {X} from "../../../assets/Icons";

const useStyles = createStyles((theme) => ({
  image: {
    borderRadius: theme.radius.lg,
    border: '2px solid ',
    boxShadow: theme.shadows.lg,
    borderColor:
      theme.colorScheme === 'dark'
        ? theme.colors.gray[8]
        : theme.colors.gray[2],
  }
}));

const UploadImagesSection = React.memo(({images, handlerRemoveImage}: any) => {
  const {classes} = useStyles();

  const gridArray = [4, 8, 8, 4, 3, 3, 6];
  return (
    <Container my="md">
      <Grid>
        {images.map((image: any, index: number) => (
          <Grid.Col sx={{position: 'relative'}} key={image.name} xs={gridArray[index]}>
            <ActionIcon
              onClick={() => handlerRemoveImage(image.name)}
              style={{position: 'absolute', zIndex: '1', top: '0', right: '0'}}
              radius="xl"
              variant="filled"
              color="red"
              size={25}
            >
              <X size={14}/>
            </ActionIcon>
            <Image
              height={150}
              radius="md"
              withPlaceholder
              key={image.lastModified}
              alt={`file preview ${index}`}
              src={URL.createObjectURL(image)}
              className={classes.image}
            />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
})

export default UploadImagesSection
