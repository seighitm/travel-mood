import React, { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  createStyles,
  Group,
  Menu,
  Paper,
  Text,
  Textarea,
} from '@mantine/core';
import useStore from '../../../store/user.store';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import ConfirmationModal from '../ConfirmationModal';
import {
  customNavigation,
  cutString,
  dateFullFormattedToIsoString,
  getFullUserName,
  userPicture,
} from '../../../utils/utils-func';
import { ROLE } from '../../../types/enums';
import { Check, Clock, Pencil, Trash, User, X } from '../Icons';
import { useMutationEditComment, useMutationRemoveComment } from '../../../api/comments/mutations';
import { isNullOrUndefined } from '../../../utils/primitive-checks';

const useStyles = createStyles((theme) => ({
  comment: {
    boxShadow: theme.shadows.sm,
    padding: `${theme.spacing.md}px ${theme.spacing.md}px`,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0],
  },
  body: {
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
  },
  commentBody: {
    boxShadow: theme.shadows.xs,
    padding: `${theme.spacing.xs}px ${theme.spacing.xs}px`,
    marginTop: theme.spacing.xs,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[1],
  },
}));

export function CommentBox({ postedAt, updatedAt, body, author, commentId, postType }: any) {
  const { classes } = useStyles();
  const { user } = useStore((state: any) => state);
  const navigate = useNavigate();
  const matchesMin900 = useMediaQuery('(min-width: 944px)');
  const matchesMin740 = useMediaQuery('(min-width: 740px)');
  const [isOpenedCommentConfirmationModalModal, setOpenedCommentConfirmationModalModal] =
    useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [commentField, setCommentField] = useState<string>('');

  const { mutate: mutateRemoveComment } = useMutationRemoveComment();
  const { mutate: mutateEditComment } = useMutationEditComment(() => {
    setCommentField('');
    setIsEditMode(false);
  });

  return (
    <Group position={'center'}>
      <ConfirmationModal
        openedConfirmationModal={isOpenedCommentConfirmationModalModal}
        setOpenedConfirmationModal={setOpenedCommentConfirmationModalModal}
        handlerSubmit={() => mutateRemoveComment({ postType, commentId })}
      />
      {matchesMin900 && (
        <Group direction={'row'}>
          <Avatar
            radius="xl"
            style={{ cursor: 'pointer' }}
            onClick={() => customNavigation(user?.role, navigate, '/users/' + author.id)}
            src={userPicture(author)}
          />
        </Group>
      )}
      <Paper
        withBorder
        radius="md"
        className={classes.comment}
        style={{ position: 'relative', width: matchesMin900 ? '80%' : '100%' }}
      >
        <Group direction={!matchesMin740 ? 'column' : 'row'} spacing={'xs'} position={'left'}>
          {matchesMin900 ? (
            <Badge pl={0} leftSection={<User size={14} />} color="gray" size="sm">
              {cutString(getFullUserName(author), 20)}
            </Badge>
          ) : (
            <Badge
              pl={0}
              size="lg"
              radius="xl"
              color="gray"
              style={{ cursor: 'pointer' }}
              onClick={() => customNavigation(user?.role, navigate, '/users/' + author.id)}
              leftSection={
                <Avatar alt="Avatar for badge" size={'xs'} mr={5} src={userPicture(author)} />
              }
            >
              {cutString(getFullUserName(author))}
            </Badge>
          )}
          <Badge pl={0} color={'gray'} size="sm" leftSection={<Clock size={14} />}>
            {dateFullFormattedToIsoString(postedAt)}
          </Badge>
          {!isNullOrUndefined(postedAt) &&
            !isNullOrUndefined(updatedAt) &&
            postedAt != updatedAt && <Badge variant={'outline'}>Updated</Badge>}
        </Group>
        <Paper withBorder radius="md" className={classes.commentBody}>
          {isEditMode ? (
            <Group style={{ width: '100%' }} direction={'column'}>
              <Textarea
                style={{ width: '100%' }}
                value={commentField}
                onChange={(event) => setCommentField(event.currentTarget.value)}
                placeholder="Your comment"
                autosize
                minRows={2}
                maxRows={5}
              />
              <Group position={'apart'} style={{ width: '100%' }}>
                <Button
                  leftIcon={<Check size={15} />}
                  compact
                  style={{ width: '45%' }}
                  onClick={() => {
                    mutateEditComment({
                      id: commentId,
                      comment: commentField,
                    });
                  }}
                >
                  Save
                </Button>
                <Button
                  leftIcon={<X size={15} />}
                  color={'red'}
                  variant="outline"
                  compact
                  style={{ width: '45%' }}
                  onClick={() => {
                    setCommentField('');
                    setIsEditMode(false);
                  }}
                >
                  Close
                </Button>
              </Group>
            </Group>
          ) : (
            <Text size="sm">{body}</Text>
          )}
        </Paper>

        {((user && user.id === author.id) || user.role != ROLE.USER) && (
          <Menu
            size="xs"
            placement="end"
            gutter={-2}
            shadow="sm"
            sx={{ position: 'absolute', top: '10px', right: '10px' }}
          >
            <Menu.Item
              color="red"
              onClick={() => setOpenedCommentConfirmationModalModal(true)}
              icon={<Trash size={14} />}
            >
              Delete
            </Menu.Item>

            {user && user.id === author.id && (
              <Menu.Item
                color="blue"
                onClick={() => {
                  if (!isEditMode) setCommentField(body);
                  setIsEditMode(!isEditMode);
                }}
                icon={<Pencil size={14} />}
              >
                Edit
              </Menu.Item>
            )}
          </Menu>
        )}
      </Paper>
    </Group>
  );
}
