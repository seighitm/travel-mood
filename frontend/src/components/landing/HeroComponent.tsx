import React from 'react';
import {Button, Container, createStyles, Overlay, Text, Title} from '@mantine/core';
import {ChevronRight} from "../../assets/Icons";

const useStyles = createStyles((theme) => ({
  hero: {
    position: 'relative',
    backgroundImage: `url(${import.meta.env.VITE_API_URL}uploads/images/hero-trip.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: theme.spacing.xl,
  },

  container: {
    height: 400,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingBottom: theme.spacing.xl * 6,
    zIndex: 1,
    position: 'relative',
    [theme.fn.smallerThan('sm')]: {
      height: 400,
      paddingBottom: theme.spacing.xl * 3,
    },
  },

  title: {
    color: theme.white,
    fontSize: 60,
    fontWeight: 900,
    lineHeight: 1.1,
    [theme.fn.smallerThan('sm')]: {
      fontSize: 40,
      lineHeight: 1.2,
    },
    [theme.fn.smallerThan('xs')]: {
      fontSize: 28,
      lineHeight: 1.3,
    },
  },

  description: {
    color: theme.white,
    maxWidth: 600,
    [theme.fn.smallerThan('sm')]: {
      maxWidth: '100%',
      fontSize: theme.fontSizes.sm,
    },
  },

  control: {
    marginTop: theme.spacing.xl * 1.5,
    [theme.fn.smallerThan('sm')]: {
      width: '100%',
    },
  },
}));

const HeroContentLeft = () => {
  const {classes} = useStyles();

  return (
    <>
      <div className={classes.hero}>
        <Overlay
          gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
          opacity={1}
          zIndex={0}
        />
        <Container className={classes.container}>
          <Title className={classes.title}>
            A fully featured React components library
          </Title>
          <Text
            className={classes.description}
            size="xl"
            mt="xl"
          >
            Build fully functional accessible web applications faster than ever – Mantine includes
            more than 120 customizable components and hooks to cover you in any situation
          </Text>

          <Button
            rightIcon={<ChevronRight size={25}/>}
            variant="gradient"
            size="xl"
            radius="xl"
            className={classes.control}
          >
            View articles
          </Button>
        </Container>
      </div>
      <div className={classes.hero}>
        <Overlay
          gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
          opacity={1}
          zIndex={0}
        />
        <Container className={classes.container} style={{alignItems: 'flex-end'}}>
          <Title className={classes.title} align={'right'}>A fully featured React components library</Title>
          <Text className={classes.description} size="xl" mt="xl">
            Build fully functional accessible web applications faster than ever – Mantine includes
            more than 120 customizable components and hooks to cover you in any situation
          </Text>

          <Button rightIcon={<ChevronRight size={25}/>} variant="gradient" size="xl" radius="xl"
                  className={classes.control} color={'pink'}>
            View current trips
          </Button>
        </Container>
      </div>
    </>
  );
};

export default HeroContentLeft;
