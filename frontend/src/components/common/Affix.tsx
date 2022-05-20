import {ArrowUpIcon} from '@modulz/radix-icons';
import {useWindowScroll} from '@mantine/hooks';
import {ActionIcon, Affix, Transition} from '@mantine/core';

const CustomAffix = () => {
  const [scroll, scrollTo] = useWindowScroll();
  return <Affix position={{bottom: 20, right: 20}}>
    <Transition transition="slide-up" mounted={scroll.y > 300}>
      {(transitionStyles) => (
        <ActionIcon
          color="green"
          radius="xl"
          variant="filled"
          style={transitionStyles}
          onClick={() => scrollTo({y: 0})}
        >
          <ArrowUpIcon/>
        </ActionIcon>
      )}
    </Transition>
  </Affix>
}

export default CustomAffix;
