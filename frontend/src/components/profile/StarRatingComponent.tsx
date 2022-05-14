import React, {useEffect, useState} from 'react';
import {ActionIcon, Group, Loader, useMantineTheme} from '@mantine/core';
import {Star} from '../../assets/Icons';
import {useMutateSetUserRating} from '../../api/users/mutations';
import useStore from "../../store/user.store";

const StarRatingComponent = ({userId, dbRating}: any) => {
  const [rating, setRating] = useState(Math.floor(dbRating));
  const [hover, setHover] = useState(0);
  const theme = useMantineTheme();
  const {mutate: mutateSetRating, isLoading, data} = useMutateSetUserRating();
  const {user} = useStore((state: any) => state);

  useEffect(() => {
    if (data != undefined) {
      setRating(data)
    }
  }, [data]);

  return (
    <Group mt={'md'} mb={'sm'} direction={'row'} position={'center'}>
      <Group spacing={3} ml={'lg'} position={'center'}>
        {[...Array(5)].map((star, index) => {
          index += 1;
          return (
            <ActionIcon
              radius={'md'}
              disabled={!user}
              color="yellow"
              type="button"
              key={index}
              onClick={() => mutateSetRating({userId, rating: index})}
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(rating)}
            >
              {index <= (hover || rating) ? (
                <Star fill={theme.colors.yellow[4]} size={17}/>
              ) : (
                <Star size={17}/>
              )}
            </ActionIcon>
          );
        })}
      </Group>
      {isLoading && <Loader size={'xs'}/>}
    </Group>
  );
};

export default StarRatingComponent;
