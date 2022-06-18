import React, {useState} from 'react';
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  createStyles,
  Group,
  Image,
  LoadingOverlay,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  Spoiler,
  Stack,
} from '@mantine/core';
import {useGetAllComplaints} from '../../../api/admin/queries';
import {useNavigate} from 'react-router-dom';
import {useMediaQuery} from '@mantine/hooks';
import {cutString, dateFormattedToIsoString, getFullUserName, userPicture,} from '../../../utils/utils-func';
import {isEmptyArray, isNullOrUndefined} from '../../../utils/primitive-checks';
import {ArrowNarrowDown, ArrowNarrowUp, Clock, Trash} from '../../common/Icons';
import {useMutateCloseComplaint} from '../../../api/admin/mutations';
import ConfirmationModal from '../../common/ConfirmationModal';

const useStyles = createStyles((theme) => ({
  comment: {
    boxShadow: theme.shadows.sm,
    padding: `${theme.spacing.xs}px ${theme.spacing.xs}px`,
    position: 'relative',
    width: '100%',
    [theme.fn.largerThan('md')]: {
      width: '70%',
    },
    border: '2px solid ',
    borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[3],
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
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
    height: '14px',
  },

  commentHeader: {
    boxShadow: theme.shadows.sm,
    position: 'relative',
    width: '100%',
    border: '1px solid ',
    borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[1],
  },
}));

function Complaints({}) {
  const {classes} = useStyles();
  const navigate = useNavigate();
  const matchesMin740 = useMediaQuery('(min-width: 740px)');
  const [isOpenedImageModal, setIsOpenedImageModal] = useState(false);
  const [selectedImage, setSelectImage] = useState<string>('');
  const {mutate: mutateCloseComplaint, isLoading: isLoadingCloseComplaint} = useMutateCloseComplaint();
  const [status, setStatus] = useState('ACTIVE');
  const {data: dbComplaints, isLoading} = useGetAllComplaints(status);
  const [isOpenedConfirmationModal, setOpenedConfirmationModal] = useState<any>(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState<any>(null);

  return (
    <>
      <ConfirmationModal
        openedConfirmationModal={isOpenedConfirmationModal}
        setOpenedConfirmationModal={setOpenedConfirmationModal}
        handlerSubmit={() => mutateCloseComplaint(selectedComplaintId)}
      />
      <Modal
        opened={isOpenedImageModal}
        onClose={() => setIsOpenedImageModal(false)}
        centered
        withCloseButton={false}
      >
        <Image height={400} src={selectedImage} withPlaceholder/>
      </Modal>
      <Group mb={'md'} position={'center'}>
        <RadioGroup value={status} onChange={setStatus}>
          <Radio value="ACTIVE" label="Active"/>
          <Radio value="CLOSED" label="Closed"/>
          <Radio value="ALL" label="All"/>
        </RadioGroup>
      </Group>

      {!isLoading && isEmptyArray(dbComplaints) && (
        <Stack justify="center" align="center" style={{height: '60vh'}}>
          <Badge variant={'outline'} size={'xl'} color={'red'}>
            There are no complaints
          </Badge>
        </Stack>
      )}

      <LoadingOverlay visible={isLoading}/>

      {!isNullOrUndefined(dbComplaints) &&
        dbComplaints?.map((item: any) => (
          <Group mb={'md'} position={'center'} align={'center'}>
            <Paper withBorder radius="md" className={classes.comment}>
              <Paper withBorder radius="md" className={classes.commentHeader} p={'xs'}>
                <Group
                  direction={!matchesMin740 ? 'column' : 'row'}
                  spacing={'xs'}
                  position={'center'}
                  align={'center'}
                >
                  <Group>
                    About:
                    <Badge
                      pl={0}
                      color="pink"
                      size="sm"
                      variant={'light'}
                      style={{cursor: 'pointer', fontSize: '13px'}}
                      onClick={() => navigate('/admin/users/' + item?.profile.id)}
                      leftSection={
                        <Avatar
                          size={'xs'}
                          style={{cursor: 'pointer'}}
                          radius="xl"
                          src={userPicture(item?.profile)}
                        />
                      }
                    >
                      {cutString(getFullUserName(item?.profile))}
                    </Badge>
                  </Group>
                  <Group>
                    From:
                    <Badge
                      pl={0}
                      variant={'light'}
                      color="blue"
                      size="sm"
                      style={{fontSize: '13px', cursor: 'pointer'}}
                      onClick={() => navigate('/admin/users/' + item?.user.id)}
                      leftSection={
                        <Avatar
                          size={'xs'}
                          style={{cursor: 'pointer'}}
                          radius="xl"
                          src={userPicture(item?.user)}
                        />
                      }
                    >
                      {cutString(getFullUserName(item?.profile))}
                    </Badge>
                  </Group>
                  <Group>
                    Date:
                    <Badge
                      variant={'light'}
                      pl={0}
                      style={{fontSize: '13px'}}
                      color={'gray'}
                      size="sm"
                      leftSection={
                        <ActionIcon size={20} pl={0}>
                          <Clock size={20}/>
                        </ActionIcon>
                      }
                    >
                      {dateFormattedToIsoString(item?.createdAt)}
                    </Badge>
                  </Group>
                </Group>
              </Paper>
              <Paper mt={'xs'} px={'xs'} withBorder radius="md" className={classes.commentHeader}>
                <Spoiler
                  maxHeight={25}
                  styles={{
                    root: {display: 'flex', justifyContent: 'space-between'},
                    content: {width: '100%'},
                  }}
                  showLabel={
                    <ActionIcon size={'sm'} color="blue" variant={'light'} radius={'xl'}>
                      <ArrowNarrowDown size={17}/>
                    </ActionIcon>
                  }
                  hideLabel={
                    <ActionIcon size={'sm'} color="blue" variant={'light'} radius={'xl'}>
                      <ArrowNarrowUp size={17}/>
                    </ActionIcon>
                  }
                >
                  {item.reason}
                  {!isNullOrUndefined(item?.image) && (
                    <Group mt={'xs'} position={'center'}>
                      <Image
                        radius={'md'}
                        mb={'xs'}
                        height={100}
                        src={`${import.meta.env.VITE_STORE_AWS}${item.image}`}
                        withPlaceholder
                        style={{cursor: 'pointer'}}
                        onClick={() => {
                          setSelectImage(`${import.meta.env.VITE_STORE_AWS}${item.image}`);
                          setIsOpenedImageModal(true);
                        }}
                      />
                    </Group>
                  )}
                </Spoiler>
              </Paper>

              {!isNullOrUndefined(item) && item.status === 'ACTIVE' ? (
                <Group mt={'sm'} position={'center'}>
                  <Button
                    mb={'xs'}
                    variant={'outline'}
                    color={'pink'}
                    compact
                    fullWidth
                    loading={isLoadingCloseComplaint}
                    onClick={() => {
                      setSelectedComplaintId(item.id);
                      setOpenedConfirmationModal(true);
                    }}
                    rightIcon={<Trash size={17}/>}
                  >
                    Close
                  </Button>
                </Group>
              ) : (
                <Group mt={'xs'} position={'center'}>
                  <Badge fullWidth color={'green'} size={'lg'} radius={'sm'}>
                    Closed
                  </Badge>
                </Group>
              )}
            </Paper>
          </Group>
        ))}
    </>
  );
}

export default Complaints;
