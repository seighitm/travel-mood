import React, { useEffect } from 'react';
import { useCheckAllProfileView } from '../../api/users/mutations';
import { useGetAllProfileVisits } from '../../api/users/queries';
import {
  Badge,
  Card,
  Container,
  Grid,
  Group,
  Image,
  Text,
  TypographyStylesProvider,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/user.store';
import {
  customNavigation,
  dateFullFormattedToIsoString,
  getFullUserName,
  userPicture,
} from '../../utils/utils-func';

function ProfileViews() {
  const navigate = useNavigate();
  const { data } = useGetAllProfileVisits();
  const { mutate: mutateCheckProfileView } = useCheckAllProfileView();
  const { user } = useStore((state: any) => state);

  useEffect(() => {
    setTimeout(() => mutateCheckProfileView(), 1000);
    return () => {
      mutateCheckProfileView();
    };
  }, []);

  return (
    <Container size={'md'}>
      <Group position={'center'}>
        <TypographyStylesProvider m={0} p={0}>
          <Text
            weight={600}
            style={{ marginTop: 0, fontSize: '30px' }}
            variant="gradient"
            gradient={{ from: 'indigo', to: 'orange' }}
          >
            Profile views
          </Text>
        </TypographyStylesProvider>
      </Group>
      <Grid>
        {data?.guests.map((item: any) => (
          <Grid.Col xs={12} sm={6} md={4} lg={3} xl={3} key={item.user.name}>
            <Card
              shadow="sm"
              p="xl"
              pb={'xs'}
              sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                border: !item.seen
                  ? `2px solid ${
                      theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6]
                    }`
                  : `2px solid transparent`,
              })}
            >
              <Card.Section mb={12} style={{ cursor: 'pointer' }}>
                <Image
                  onClick={() => customNavigation(user?.role, navigate, '/users/' + item.user.id)}
                  caption={getFullUserName(item.user)}
                  src={userPicture(item.user)}
                  height={200}
                  withPlaceholder
                  alt="User image"
                />
              </Card.Section>
              <Group position={'center'}>
                <Badge>{dateFullFormattedToIsoString(item.createdAt)}</Badge>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}

export default ProfileViews;
