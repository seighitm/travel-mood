import React, {useEffect} from 'react';
import {useCheckAllProfileView} from '../../api/users/mutations';
import {useGetAllProfileVisits} from '../../api/users/queries';
import {Badge, Card, Container, Grid, Group, Image} from '@mantine/core';
import {useNavigate} from 'react-router-dom';
import {userPicture} from "../common/Utils";

function ProfileViews() {
  const navigate = useNavigate();
  const {data} = useGetAllProfileVisits();
  const {mutate: mutateCheckProfileView} = useCheckAllProfileView();

  useEffect(() => {
    return () => {
      mutateCheckProfileView();
    }
  }, []);

  return <Container size={'md'}>
    <Grid>
      {data?.guests.map((item: any) => (
        <Grid.Col xs={12} sm={6} md={4} xl={4} lg={4} key={item.user.name}>
          <Card
            shadow="sm"
            p="xl"
            sx={(theme) => ({
              border: !item.seen
                ? `2px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6]}`
                : '',
            })}
          >
            <Card.Section mb={12} style={{cursor: 'pointer'}}>
              <Image
                onClick={() => navigate('/user/' + item.user.id)}
                caption={`${item.user?.lastName} ${item.user?.firstName}`}
                src={userPicture(item.user)}
                height={180}
                alt="User image."
              />
            </Card.Section>
            <Group position={'center'}>
              <Badge>{new Date(item.createdAt).toISOString().split('T')[0]}</Badge>
            </Group>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  </Container>
}

export default ProfileViews;
