import React from 'react';
import {Anchor, Breadcrumbs, Paper, Text} from "@mantine/core";
import {Link, useLocation} from "react-router-dom";

function CustomBreadcrumbs() {
  const location = useLocation()
  const path = location.pathname.split('/')
  path.shift()
  path.shift()

  let items: any = [
    {title: 'Home', href: 'admin'},
  ]

  for (let i = 0; i < path.length; i++) {
    if (path[i] == 'chat')
      items.push({title: 'Chat', href: '/chat'})
    if (path[i] == 'user')
      items.push({title: 'User', href: '/user/:id'})
    if (path[i] == 'users')
      items.push({title: 'Users', href: 'admin/users'})
    if (path[i] == 'map')
      items.push({title: 'Map', href: '/map'})
    if (path[i] == 'articles')
      items.push({title: 'Articles', href: 'admin/articles'})
    if (path[i - 1] == 'articles' && path[i] == 'add')
      items.push({title: 'NewArticle', href: '/articles/add'})
    if (path[i - 1] == 'trips' && path[i] == 'add')
      items.push({title: 'NewTrips', href: '/trips/add'})
    if (path[i] == 'trips')
      items.push({title: 'Trips', href: 'admin/trips'})
  }

  const breadcrumbs = items.map((item: any, index: any) => {
      if (index == items.length - 1)
        return <Text>
          {item.title}
        </Text>
      else
        return <Anchor component={Link} to={item.href} key={index}>
          {item.title}
        </Anchor>
    }
  );

  return (
    <Paper
      mt={0}
      mb={'lg'}
      p={3}
      radius={'sm'}
      sx={(theme) => ({
        border: '2px solid ',
        borderColor:
          theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
      })}
    >
      <Breadcrumbs>{breadcrumbs}</Breadcrumbs>
    </Paper>
  );
}

export default CustomBreadcrumbs;
