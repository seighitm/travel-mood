import {formList, useForm} from '@mantine/form';
import {ActionIcon, Box, Button, Group, Modal, Text, TextInput} from '@mantine/core';
import {PlusIcon, TrashIcon} from "@modulz/radix-icons";

function CreateModal({modalHandler, isOpenModal, handler}: any) {
  const form = useForm({
    initialValues: {
      row: formList([{field: ''}]),
    },
  });

  const handlerSubmit = () => {
    handler(form.values.row.map((item: any) => item.field))
    form.reset()
  }

  const fields = form.values.row.map((_, index) => (
    <Group key={index} mt="xs">
      <TextInput
        placeholder="John Doe"
        required
        sx={{flex: 1}}
        {...form.getListInputProps('row', index, 'field')}
      />
      <ActionIcon
        color="red"
        variant="hover"
        onClick={() => form.removeListItem('row', index)}
      >
        <TrashIcon style={{width: '16px', height: '16px'}}/>
      </ActionIcon>
    </Group>
  ));

  return (
    <div>
      <Modal
        centered
        opened={isOpenModal}
        onClose={() => modalHandler.close()}
        withCloseButton={false}
      >
        <Box sx={{maxWidth: 500}} mx="auto">
          {fields.length > 0 ? (
            <Group mb="xs">
              <Text weight={500} size="sm" sx={{flex: 1}}>
                Name
              </Text>
            </Group>
          ) : (
            <Text color="dimmed" align="center">
              No one here...
            </Text>
          )}

          {fields}

          <Group position="center" mt="md">
            <ActionIcon
              variant={'light'}
              color={'pink'}
              onClick={() => form.addListItem('row', {field: ''})}
            >
              <PlusIcon/>
            </ActionIcon>
            <Button onClick={handlerSubmit}>
              Save
            </Button>
          </Group>
        </Box>
      </Modal>
    </div>
  );
}

export default CreateModal;
