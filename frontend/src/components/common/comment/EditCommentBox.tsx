import useStore from '../../../store/user.store';
import {useNavigate} from 'react-router-dom';
import {Avatar, Button, createStyles, Group, LoadingOverlay, Textarea} from '@mantine/core';
import {creteAuthorShortName, userPicture} from '../Utils';
import React, {useState} from 'react';
import {useMediaQuery} from '@mantine/hooks';
import {Check, X} from "../../../assets/Icons";

const useStyles = createStyles((theme) => ({
  comment: {
    boxShadow: theme.shadows.sm,
    padding: `${theme.spacing.md}px ${theme.spacing.md}px`,
    marginBottom: theme.spacing.lg,
    marginTop: '15px',
    paddingLeft: '16px',
    paddingRight: '16px',
  },
}));

export function EditCommentBox({mutateCreateComment, id, isLoading}: any) {
  const {classes} = useStyles();
  const navigate = useNavigate();
  const [commentField, setCommentField] = useState<string>('');
  const {user} = useStore((state: any) => state);
  const matches = useMediaQuery('(min-width: 900px)');

  const handlerClearCommentEditBox = () => {
    setCommentField('');
  };

  const handlerSubmitComment = () => {
    mutateCreateComment({id: id, comment: commentField,});
    setCommentField('');
  };

  return (
    <Group position={'center'}>
      <Group position={'center'} style={{position: 'relative', width: '100%'}}>
        <LoadingOverlay visible={isLoading}/>
        {matches &&
          <Group direction={'column'}>
            <Avatar
              style={{cursor: 'pointer'}}
              radius="xl"
              onClick={() => navigate('/user/' + user?.id)}
              src={userPicture(user)}
            >
              {creteAuthorShortName(`${user.firstName} ${user.lastName}`)}
            </Avatar>
          </Group>
        }
        <Group
          direction={'column'}
          spacing={5}
          position={'right'}
          className={classes.comment}
          style={{width: matches ? '80%' : '100%'}}
        >
          <Textarea
            style={{width: '100%'}}
            value={commentField}
            onChange={(event) => setCommentField(event.currentTarget.value)}
            placeholder="Your comment"
            autosize
            minRows={3}
            maxRows={5}
          />
          <Group spacing={0}>
            <Button
              type={'submit'}
              variant="filled"
              compact
              onClick={handlerSubmitComment}
              style={{borderRadius: '7px 0 0 7px'}}
              leftIcon={<Check size={17}/>}
              disabled={commentField == ''}
            >
              Send
            </Button>
            <Button
              onClick={handlerClearCommentEditBox}
              variant="subtle"
              color={'red'}
              compact
              leftIcon={<X size={17}/>}
              style={{borderRadius: '0 7px 7px 0'}}
              disabled={commentField == ''}
            >
              Clear
            </Button>
          </Group>
        </Group>
      </Group>
    </Group>
  );
}
