import useStore from '../../../store/user.store';
import { useNavigate } from 'react-router-dom';
import {
  ActionIcon,
  Avatar,
  Center,
  createStyles,
  Group,
  Progress,
  RingProgress,
  Stack,
  Textarea,
  ThemeIcon,
} from '@mantine/core';
import React, { useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { Check, X } from '../Icons';
import { useMutateAddComment } from '../../../api/comments/mutations';
import { creteAuthorShortName, customNavigation, userPicture } from '../../../utils/utils-func';
import { XL_ICON_SIZE } from '../../../utils/constants';

const useStyles = createStyles((theme) => ({
  wrapper: {
    boxShadow: theme.shadows.sm,
    padding: `${theme.spacing.md}px ${theme.spacing.md}px`,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0],
  },
  comment: {
    boxShadow: theme.shadows.sm,
    padding: `${theme.spacing.md}px ${theme.spacing.md}px`,
    marginTop: '10px',
    paddingLeft: '10px',
    paddingRight: '10px',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0],
    border:
      '1px solid ' + (theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4]),
    borderRadius: '8px',
    width: '100%',
    [theme.fn.largerThan(944)]: {
      width: '80%',
    },
  },
  commentBox: {
    width: '94%',
    [theme.fn.smallerThan('md')]: {
      width: '94%',
    },
    [theme.fn.smallerThan('sm')]: {
      width: '92%',
    },
    [theme.fn.smallerThan('xs')]: {
      width: '87%',
    },
  },
}));

export function EditCommentBox({ id, postType }: any) {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [commentField, setCommentField] = useState<string>('');
  const { user } = useStore((state: any) => state);
  const matchesMin900 = useMediaQuery('(min-width: 944px)');
  const { mutate: mutateCreateComment, isLoading: isLoadingCreateComment } = useMutateAddComment();

  const MAX_CHARACTER_LENGTH = 500;

  const handlerClearCommentEditBox = () => {
    setCommentField('');
  };

  const handlerSubmitComment = () => {
    mutateCreateComment({ id: id, comment: commentField, postType: postType });
    setCommentField('');
  };

  return (
    <Group position={'center'}>
      <Group
        mb={'xs'}
        spacing={0}
        position={'center'}
        style={{ position: 'relative', width: '100%' }}
      >
        {matchesMin900 && (
          <Group direction={'column'}>
            <RingProgress
              thickness={commentField.length == 0 ? 0 : 6}
              size={60}
              roundCaps
              sections={[
                {
                  value: (commentField.length * 100) / MAX_CHARACTER_LENGTH,
                  color: commentField.length <= MAX_CHARACTER_LENGTH ? 'teal' : 'red',
                },
              ]}
              label={
                <Center style={{ position: 'relative' }}>
                  <Avatar
                    style={{ cursor: 'pointer' }}
                    radius="xl"
                    src={userPicture(user)}
                    onClick={() => customNavigation(user?.role, navigate, '/users/' + user?.id)}
                  >
                    {creteAuthorShortName(`${user.firstName} ${user.lastName}`)}
                  </Avatar>
                  {commentField.length != 0 && (
                    <ThemeIcon
                      style={{ position: 'absolute' }}
                      color={commentField.length <= MAX_CHARACTER_LENGTH ? 'teal' : 'red'}
                      variant="light"
                      radius="xl"
                      size="xl"
                    >
                      {commentField.length <= MAX_CHARACTER_LENGTH ? (
                        commentField.length
                      ) : (
                        <X size={XL_ICON_SIZE} />
                      )}
                    </ThemeIcon>
                  )}
                </Center>
              }
            />
          </Group>
        )}
        <Group direction={'row'} spacing={0} position={'apart'} className={classes.comment}>
          <Textarea
            className={classes.commentBox}
            value={
              commentField?.length <= MAX_CHARACTER_LENGTH
                ? commentField
                : commentField.slice(0, MAX_CHARACTER_LENGTH)
            }
            onChange={(event) => setCommentField(event.currentTarget.value)}
            placeholder="Your comment"
            autosize
            minRows={3}
            maxRows={5}
          />
          <Stack style={{ height: '100%' }}>
            <ActionIcon
              loading={isLoadingCreateComment}
              style={{ height: '100%' }}
              type={'submit'}
              variant="filled"
              color={'blue'}
              onClick={handlerSubmitComment}
              disabled={commentField == '' || isLoadingCreateComment}
            >
              <Check size={17} />
            </ActionIcon>
            <ActionIcon
              loading={isLoadingCreateComment}
              onClick={handlerClearCommentEditBox}
              color={'red'}
              variant={'outline'}
              disabled={commentField == '' || isLoadingCreateComment}
            >
              <X size={17} />
            </ActionIcon>
          </Stack>
          {!matchesMin900 && commentField?.length != 0 && (
            <Progress
              size="lg"
              mt={'xs'}
              className={classes.commentBox}
              striped
              animate
              value={(commentField.length * 100) / MAX_CHARACTER_LENGTH}
              color={commentField.length <= MAX_CHARACTER_LENGTH ? 'teal' : 'red'}
            />
          )}
        </Group>
      </Group>
    </Group>
  );
}
