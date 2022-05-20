import React, {useState} from 'react';
import {Avatar, Badge, Container, createStyles, Group, Image, Modal, Paper, Spoiler} from "@mantine/core";
import {useGetAllComplaints} from "../../../api/users/queries";
import {ClockIcon} from "@modulz/radix-icons";
import useStore from "../../../store/user.store";
import {useNavigate} from "react-router-dom";
import {useDisclosure, useMediaQuery} from "@mantine/hooks";
import {cutString, dateFormatedToIsoString, userPicture} from "../../common/Utils";
import {getFullUserName} from "../../../utils/utils-func";
import {isNullOrUndefined} from "../../../utils/primitive-checks";

const useStyles = createStyles((theme) => ({
  comment: {
    boxShadow: theme.shadows.sm,
    padding: `${theme.spacing.md}px ${theme.spacing.md}px`,
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

function Complaints({}) {
  const {data} = useGetAllComplaints()
  console.log(data)

  const {classes} = useStyles();
  const {user} = useStore((state: any) => state);
  const navigate = useNavigate();
  const matches1 = useMediaQuery('(min-width: 900px)');
  const matches2 = useMediaQuery('(min-width: 740px)');
  const [openedImageModal, handlersImageModal] = useDisclosure(false);
  const [selectedImage, setSelectImage] = useState<string>('')
  return <Container>
    <Modal
      opened={openedImageModal}
      onClose={() => handlersImageModal.close()}
      centered
      withCloseButton={false}
    >
      <Image height={400} src={selectedImage} withPlaceholder/>
    </Modal>
    {data && data?.map((item: any) =>
      <Group mb={'md'} position={'center'} align={'center'}>
        {matches1 && (
          <Group direction={'row'}>
            <Avatar
              style={{cursor: 'pointer'}}
              radius="xl"
              onClick={() => navigate('/user/' + item?.user.id)}
              src={userPicture(item?.user)}
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
            {matches1
              ? <Badge
                pl={0}
                color="gray" size="sm"
                style={{cursor: 'pointer'}}
                onClick={() => navigate('/user/' + item?.profile.id)}
                leftSection={
                  <Avatar
                    size={'xs'}
                    style={{cursor: 'pointer'}}
                    radius="xl"
                    onClick={() => navigate('/user/' + item?.profile.id)}
                    src={userPicture(item?.profile)}
                  />
                }
              >
                {cutString(getFullUserName(item?.profile))}
              </Badge>
              : <Badge
                pl={0}
                sx={{cursor: 'pointer'}}
                size="lg"
                radius="xl"
                color="gray"
                leftSection={
                  <Avatar alt="Avatar for badge"
                          size={'xs'}
                          mr={5}
                          onClick={() => navigate('/user/' + item?.profile.id)}
                          src={userPicture(item?.profile)}
                  />
                }
              >
                {cutString(getFullUserName(item?.profile))}
              </Badge>
            }
            <Badge pl={0} leftSection={<ClockIcon className={classes.icon}/>} color={'gray'} size="sm">
              {dateFormatedToIsoString(item?.createdAt)}
            </Badge>
          </Group>
          <Spoiler
            mt={'sm'}
            style={{display: 'flex', flexDirection: 'column'}}
            maxHeight={20}
            showLabel={'Show all'}
            hideLabel={'Hide'}
          >
            {item.reason}

            {!isNullOrUndefined(item?.image) &&
              <Group position={'center'}>
                <Image height={100} src={`${import.meta.env.VITE_STORE_AWS}${item.image.image}`} withPlaceholder
                       style={{cursor: 'pointer'}}
                       onClick={() => {
                         setSelectImage(`${import.meta.env.VITE_STORE_AWS}${item.image.image}`)
                         handlersImageModal.open()
                       }}
                />
              </Group>
            }
          </Spoiler>
        </Paper>
      </Group>
    )}
  </Container>
}

export default Complaints;
