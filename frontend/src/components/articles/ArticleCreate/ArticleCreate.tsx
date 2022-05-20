import React, {useMemo, useRef, useState} from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Image,
  MultiSelect,
  TextInput,
  ThemeIcon
} from '@mantine/core';
import DropzoneArea from '../../common/DropzoneArea';
import UploadImagesSection from './UploadImagesComponent';
import {useGetLocations} from '../../../api/countries/queries';
import {Check, DeviceFloppy, X} from "../../../assets/Icons";
import {useAddArticle} from "../../../api/articles/mutations";
import {FilePlusIcon} from "@modulz/radix-icons";
import Editor from "../../common/editor/Editor";
import {useTagsQuery} from "../../../api/tags/queries";
import {useForm} from "@mantine/form";

function ArticleCreate() {
  const openRef = useRef<any>();
  const [editorError, setEditorError] = useState('')
  const [editorContent, setEditorContent] = useState<any>('');
  const [editorImages, setEditorImages] = useState<any>([])
  const [tags, setTags] = useState<any>([]);
  const [titleImage, setTitleImage] = useState<any>(null);
  const [articleImages, setArticleImages] = useState<any>([]);

  const {data: dbTags} = useTagsQuery({});
  const {data: dbCountries} = useGetLocations({})

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      tags: [],
      countries: [],
    },
    validate: {
      title: (value) => {
        if (value?.trim().length <= 8) return 'Title should have at least 5 letters!'
      },
      description: (value) => {
        if (value?.trim().length <= 8) return 'Title should have at least 5 letters!'
      },
      countries: (value) => {
        if (value.length == 0) return 'Add at least one country!'
      }
    }
  });

  const handlerDeleteTitleImage = () => {
    setTitleImage(null)
    openRef.current.value = '';
  }

  const handlerRemoveImage = (name: string) => {
    if (name == titleImage?.name) {
      handlerDeleteTitleImage()
    }
    setArticleImages(articleImages.filter((item: any) => item.name != name))
  }

  const handlerRemoveUnusedEditorImages = () => {
    // const allImages: any = editorContent.match(/http:\/\/localhost([^"]*)/g)?.map((item: any) =>
    //   item.split('/')[item.split('/').length - 1]
    // )
    // if (allImages && allImages?.length != 0) {
    //   const imagesToRemove = editorImages.filter((image: any) => !allImages.includes(image))
    //   removeFiles(imagesToRemove)
    // } else {
    //   removeFiles(editorImages)
    // }
    // setEditorImages([])
  }

  const {
    mutate: mutateAddArticle,
    isLoading: isLoadingMutateAddArticle
  } = useAddArticle({onSuccessEvent: handlerRemoveUnusedEditorImages});

  const handleSubmit = async (data: any) => {
    if (editorContent.length >= 30) {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('body', editorContent);
      formData.append('isPrimaryImage', (!!titleImage).toString());

      if (data.tags?.length != 0) {
        for (let i = 0; i < data.tags.length; i++) {
          formData.append('tagList[]', data.tags[i]);
        }
      }

      if (titleImage) {
        formData.append('images[]', titleImage);
      }

      if (articleImages.length != 0) {
        for (let i = 0; i < articleImages.length; i++) {
          if ((articleImages[i].name != titleImage?.name) && (articleImages[i].size != titleImage?.size)) {
            formData.append('images[]', articleImages[i]);
          }
        }
      }

      if (data.countries.length != 0) {
        for (let i = 0; i < data.countries.length; i++) {
          formData.append('countries[]', data.countries[i]);
        }
      }

      mutateAddArticle(formData);
    } else {
      setEditorError('Article content should have at least 30 letters')
    }
  };

  return (
    <Container size='md' p='sm'>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          required
          label='Title'
          placeholder='Enter article title...'
          {...form.getInputProps('title')}
        />

        <input
          style={{display: 'none'}}
          ref={openRef}
          type={'file'}
          onChange={(e: any) => {
            // setTitleImage(null)
            // openRef.current.value = ''
            setTitleImage(e.target.files[0])
          }}
        />

        {titleImage
          ? <Box style={{position: 'relative'}}>
            <Image
              src={titleImage && URL.createObjectURL(titleImage)}
              mt={'sm'}
              mb={'sm'}
              height={150}
              radius='md'
            />
            <ActionIcon
              onClick={handlerDeleteTitleImage}
              style={{position: 'absolute', zIndex: '1', bottom: '-10px', right: '50%'}}
              radius='xl'
              variant='filled'
              color='red'
              size={22}
            >
              <X size={17}/>
            </ActionIcon>
          </Box>
          : <Button
            mt={'sm'}
            mb={'sm'}
            variant={'light'}
            fullWidth
            leftIcon={<FilePlusIcon/>}
            onClick={() => openRef.current.click()}
          >
            Title Image
          </Button>
        }

        <TextInput
          required
          label='Description'
          placeholder='Enter article description...'
          {...form.getInputProps('description')}
        />

        <MultiSelect
          searchable
          creatable
          label='Tags'
          placeholder='Enter tag name...'
          data={dbTags ? dbTags.map((tag: any) => '#' + tag.name) : []}
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => setTags((current: any) => [...current, query])}
          {...form.getInputProps('tags')}
        />

        <MultiSelect
          required
          searchable
          label='Countries'
          placeholder='Enter country name...'
          {...form.getInputProps('countries')}
          data={dbCountries ? dbCountries.map((country: any) => ({
            value: country.code,
            label: country.name,
          })) : []}
        />

        {useMemo(() => {
          return <Editor
            value={editorContent}
            onChange={setEditorContent}
            setEditorImages={setEditorImages}
          />;
        }, [])}

        {editorError != '' &&
          <Group my={'xs'} position={'center'}>
            <Badge color={'red'}>
              {editorError}
            </Badge>
          </Group>
        }

        <DropzoneArea
          setFiles={setArticleImages}
          files={articleImages}
        />

        {useMemo(() =>
          <UploadImagesSection
            images={titleImage ? (
              articleImages.find((image: any) => image?.name == titleImage.name) != undefined
                ? [...articleImages]
                : [...articleImages, titleImage]
            ) : [...articleImages]}
            handlerRemoveImage={handlerRemoveImage}
          />, [articleImages, titleImage])}

        <Divider
          my={'lg'}
          labelPosition="center"
          style={{width: '100%'}}
          label={(Object.keys(form.errors).length !== 0 || editorError != '')
            ? <ThemeIcon variant={'light'} color={'red'}><X size={17}/></ThemeIcon>
            : <ThemeIcon variant={'light'} color={'blue'}><Check size={17}/></ThemeIcon>
          }
        />

        <Group mt={'lg'} position={'center'}>
          <Button
            size='lg'
            compact
            fullWidth
            type='submit'
            disabled={isLoadingMutateAddArticle}
            loading={isLoadingMutateAddArticle}
            leftIcon={<DeviceFloppy size={17} color={'white'}/>}
          >
            Save
          </Button>
        </Group>
      </form>
    </Container>
  );
}

export default ArticleCreate;
