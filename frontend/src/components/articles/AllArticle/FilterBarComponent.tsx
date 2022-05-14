import React, {forwardRef, useState} from 'react';
import {
  Accordion,
  Autocomplete,
  Avatar,
  Button,
  createStyles,
  Group,
  MultiSelect,
  SimpleGrid,
  Text,
} from '@mantine/core';
import {useFilterUser, useGetUsersByNameOrEmail} from '../../../api/users/queries';
import {useTagsQuery} from "../../../api/tags/queries";
import {useDebouncedValue} from "@mantine/hooks";
import {ChevronDown, Search, X} from "../../../assets/Icons";
import {useGetAllArticles} from "../../../api/articles/queries";
import {useGetLocations} from "../../../api/countries/queries";
import {getFullUserName} from "../../../utils/utils-func";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('control');
  return {
    wrapper: {
      marginBottom: theme.spacing.md,
      borderRadius: theme.radius.md,
      border: '2px solid ',
      borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
    },
    title: {
      color: theme.white,
      fontSize: 52,
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },
    item: {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
      borderBottom: 0,
      borderRadius: theme.radius.md,
      boxShadow: theme.shadows.xs,
    },
    control: {
      fontSize: theme.fontSizes.lg,
      padding: `${theme.spacing.xs}px ${theme.spacing.xl}px`,
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    content: {
      paddingLeft: theme.spacing.xl,
      lineHeight: 1.6,
    },
    icon: {
      ref: icon,
      marginLeft: theme.spacing.md,
    },
    gradient: {
      backgroundImage: `radial-gradient(${theme.colors[theme.primaryColor][6]} 0%, ${
        theme.colors[theme.primaryColor][5]
      } 100%)`,
    },
  };
});

const AutoCompleteItem = forwardRef<HTMLDivElement, any>(
  ({description, value, image, ...others}: any, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={'https://source.unsplash.com/random/300x300'} radius={'lg'}/>
        <div>
          <Text>{value}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);

export function FilterBarComponent({activePage}: any) {
  const {classes} = useStyles();

  const [selectedCountries, setSelectedCountries] = useState<any>([]);
  const [userName, setUserName] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<any>([]);
  const [debouncedFirstName] = useDebouncedValue(userName, 200);

  const {data: dbUsers} = useGetUsersByNameOrEmail(debouncedFirstName);
  const {data: dbCountries} = useGetLocations({isEnabled: true});
  const {data: dbTags} = useTagsQuery({});

  const {refetch: refetchArticles} = useGetAllArticles({
    page: activePage,
    author: userName,
    countries: selectedCountries,
    tags: selectedTags,
  });

  const handlerResetFilter = () => {
    setSelectedCountries([]);
    setUserName('');
    setSelectedTags([]);
  };

  const handlerRrefetchArticles = async () => {
    await refetchArticles();
  };

  console.log(userName)

  return (
    <div className={classes.wrapper}>
      <Accordion
        iconPosition="right"
        initialItem={-1}
        classNames={{
          item: classes.item,
          control: classes.control,
          icon: classes.icon,
          contentInner: classes.content,
        }}
        icon={<ChevronDown size={17}/>}
      >
        <Accordion.Item label="Filter">
          <SimpleGrid mb={'lg'} cols={2}>
            <MultiSelect
              clearButtonLabel="Clear selection"

              data={dbTags && dbTags?.length >= 0
                ? dbTags?.map((item: any) => ({
                  value: item.name,
                  label: item.name,
                })) : []
              }
              clearable
              searchable
              placeholder="Tags"
              value={selectedTags}
              onChange={setSelectedTags}
            />

            <MultiSelect
              clearButtonLabel="Clear selection"
              data={dbCountries && dbCountries?.length != 0
                ? dbCountries?.map((item: any) => ({
                  value: item.code,
                  label: item.name,
                })) : []
              }
              clearable
              searchable
              value={selectedCountries}
              onChange={setSelectedCountries}
              placeholder="Countries"
            />

            <Autocomplete
              placeholder="Users"
              value={userName}
              onChange={setUserName}
              data={userName && dbUsers ? dbUsers.map((us: any) => (getFullUserName(us))) : []}
            />

            {/*<MultiSelect*/}
            {/*  placeholder="Users"*/}
            {/*  data={searchUser && dbUsers ? dbUsers.map((item: any) => item.firstName + " " + item.lastName) : []}*/}
            {/*  clearable*/}
            {/*  searchable*/}
            {/*  value={searchUser}*/}
            {/*  onChange={setSearchUser}*/}
            {/*/>*/}
            <Group grow position={'right'}>
              <Button
                leftIcon={<Search size={17}/>}
                onClick={handlerRrefetchArticles}
              >
                Filter
              </Button>
              <Button
                leftIcon={<X size={17}/>}
                color="red"
                variant={'light'}
                onClick={handlerResetFilter}
              >
                Reset
              </Button>
            </Group>
          </SimpleGrid>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
