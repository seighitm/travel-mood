import React, {useState} from 'react';
import {Accordion, Autocomplete, Button, createStyles, Grid, Group, MultiSelect, TextInput,} from '@mantine/core';
import {useGetUsersByNameOrEmail} from '../../../api/users/queries';
import {useTagsQuery} from "../../../api/tags/queries";
import {getHotkeyHandler, useDebouncedValue} from "@mantine/hooks";
import {ChevronDown, Search, User, World, X} from "../../../assets/Icons";
import {useGetAllArticles} from "../../../api/articles/queries";
import {useGetLocations} from "../../../api/countries/queries";
import {getFullUserName} from "../../../utils/utils-func";
import {isEmptyArray, isNullOrUndefined} from "../../../utils/primitive-checks";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('control');
  return {
    wrapper: {
      marginBottom: theme.spacing.md,
      borderRadius: theme.radius.md,
      border: '2px solid ',
      borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
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

export function FilterBarComponent({activePage}: any) {
  const {classes} = useStyles();

  const [selectedCountries, setSelectedCountries] = useState<any>([]);
  const [userName, setUserName] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<any>([]);
  const [debouncedFirstName] = useDebouncedValue(userName, 200);
  const [title, setTitle] = useState<string>('')

  const {data: dbUsers} = useGetUsersByNameOrEmail(debouncedFirstName);
  const {data: dbCountries} = useGetLocations({isEnabled: true});
  const {data: dbTags} = useTagsQuery({});

  const {refetch: refetchArticles} = useGetAllArticles({
    page: activePage,
    author: userName,
    countries: selectedCountries,
    tags: selectedTags,
    title: title,
  });

  const handlerResetFilter = () => {
    setSelectedCountries([]);
    setUserName('');
    setSelectedTags([]);
    setTimeout(() => refetchArticles(), 5)
  };

  const handlerRrefetchArticles = async () => {
    await refetchArticles();
  };

  return (
    <div className={classes.wrapper}>
      <Accordion
        iconPosition="right"
        initialItem={-1}
        icon={<ChevronDown size={17}/>}
        classNames={{
          item: classes.item,
          control: classes.control,
          icon: classes.icon,
          contentInner: classes.content,
        }}
      >
        <Accordion.Item label="Filter">
          <TextInput
            onKeyDown={getHotkeyHandler([
              ['Enter', handlerRrefetchArticles],
            ])}
            mb={'sm'}
            icon={<Search size={15}/>}
            value={title}
            onChange={({currentTarget}: any) => setTitle(currentTarget.value)}
            placeholder="Title"
          />
          <Grid>
            <Grid.Col md={6} lg={4}>

              <MultiSelect
                clearButtonLabel="Clear selection"
                data={!isNullOrUndefined(dbTags) && !isEmptyArray(dbTags)
                  ? dbTags?.map((item: any) => ({
                    value: item.name,
                    label: item.name,
                  })) : []
                }
                icon={'#'}
                clearable
                searchable
                placeholder="Tags"
                value={selectedTags}
                onChange={setSelectedTags}
              />
            </Grid.Col>
            <Grid.Col md={6} lg={4}>
              <MultiSelect
                limit={20}
                clearButtonLabel="Clear selection"
                data={!isNullOrUndefined(dbCountries) && !isEmptyArray(dbCountries)
                  ? dbCountries?.map((item: any) => ({
                    value: item.code,
                    label: item.name,
                  })) : []
                }
                clearable
                icon={<World size={15}/>}
                searchable
                value={selectedCountries}
                onChange={setSelectedCountries}
                placeholder="Countries"
              />
            </Grid.Col>
            <Grid.Col md={6} lg={4}>
              <Autocomplete
                icon={<User size={15}/>}
                placeholder="Users"
                value={userName}
                onChange={setUserName}
                data={userName && dbUsers ? dbUsers.map((us: any) => (getFullUserName(us))) : []}
              />
            </Grid.Col>
            <Grid.Col md={6} lg={8}>
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
            </Grid.Col>
          </Grid>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
