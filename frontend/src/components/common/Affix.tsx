import { useWindowScroll } from '@mantine/hooks';
import { ActionIcon, Affix, Transition } from '@mantine/core';
import { ArrowUp } from './Icons';

const CustomAffix = () => {
  const [scroll, scrollTo] = useWindowScroll();
  return (
    <Affix position={{ bottom: 20, right: 20 }}>
      <Transition transition="slide-up" mounted={scroll.y > 400}>
        {(transitionStyles) => (
          <ActionIcon
            color="green"
            radius="xl"
            variant="light"
            style={transitionStyles}
            onClick={() => scrollTo({ y: 0 })}
          >
            <ArrowUp size={18} />
          </ActionIcon>
        )}
      </Transition>
    </Affix>
  );
};

export default CustomAffix;
