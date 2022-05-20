import React, {useState} from 'react';
import {Avatar, Badge, createStyles, Group, Menu, Paper, Text} from '@mantine/core';
import useStore from '../../../store/user.store';
import {useNavigate} from 'react-router-dom';
import {cutString, userPicture} from '../Utils';
import {useMediaQuery} from '@mantine/hooks';
import {ClockIcon, PersonIcon, TrashIcon} from "@modulz/radix-icons";
import ConfirmationModal from "../../profile/user-images/modals/ConfirmationModal";
import {getFullUserName} from "../../../utils/utils-func";

const useStyles = createStyles((theme) => ({
  comment: {
    boxShadow: theme.shadows.sm,
    padding: `${theme.spacing.md}px ${theme.spacing.md}px`,
    marginBottom: theme.spacing.lg,
  },

  body: {
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
  },

  content: {
    '& > p:last-child': {
      marginBottom: 0,
    },
  },

  icon: {
    width: '14px',
    height: '14px'
  }
}));

export function CommentBox({postedAt, body, author, commentId, mutateRemoveComment}: any) {
  const {classes} = useStyles();
  const {user} = useStore((state: any) => state);
  const navigate = useNavigate();
  const matches1 = useMediaQuery('(min-width: 900px)');
  const matches2 = useMediaQuery('(min-width: 740px)');
  const [isOpenedCommentConfirmationModalModal, setOpenedCommentConfirmationModalModal] = useState(false);

  return (
    <Group position={'center'}>
      <ConfirmationModal
        openedConfirmationModal={isOpenedCommentConfirmationModalModal}
        setOpenedConfirmationModal={setOpenedCommentConfirmationModalModal}
        handlerSubmit={() => mutateRemoveComment({commentId: commentId})}
      />
      {matches1 && (
        <Group direction={'row'}>
          <Avatar
            style={{cursor: 'pointer'}}
            radius="xl"
            onClick={() => navigate('/user/' + author.id)}
            src={userPicture(author)}
          />
        </Group>
      )}
      <Paper
        style={{position: 'relative', width: matches1 ? '80%' : '100%'}}
        withBorder
        radius="md"
        className={classes.comment}
      >
        <Group direction={!matches2 ? 'column' : 'row'} spacing={'xs'} position={'left'}>
          {matches1 ? (
            <Badge pl={0} leftSection={<PersonIcon className={classes.icon}/>} color="gray" size="sm">
              {cutString(getFullUserName(author), 20)}
            </Badge>
          ) : (
            <Badge
              onClick={() => navigate('/user/' + author.id)}
              pl={0}
              sx={{cursor: 'pointer'}}
              size="lg"
              radius="xl"
              color="gray"
              leftSection={
                <Avatar alt="Avatar for badge" size={'xs'} mr={5} src={userPicture(author)}/>
              }
            >
              {cutString(getFullUserName(author))}
            </Badge>
          )}
          <Badge pl={0} leftSection={<ClockIcon className={classes.icon}/>} color={'gray'} size="sm">
            {postedAt}
          </Badge>
        </Group>
        <Group>
          <Text className={classes.body} size="sm">
            {body}
          </Text>
        </Group>

        {(user && user.id === author.id) && (
          <Menu
            size="xs"
            placement="end"
            gutter={-2}
            shadow="sm"
            sx={{position: 'absolute', top: '10px', right: '10px'}}
          >
            <Menu.Item
              onClick={() => setOpenedCommentConfirmationModalModal(true)}
              icon={<TrashIcon className={classes.icon}/>}
              color="red"
            >
              Delete
            </Menu.Item>
          </Menu>
        )}
      </Paper>
    </Group>
  );
}
