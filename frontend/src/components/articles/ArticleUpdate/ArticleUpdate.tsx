import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ActionIcon, Box, Button, Divider, Grid, Image, MultiSelect, SimpleGrid, TextInput,} from '@mantine/core';
import {useNavigate, useParams} from 'react-router-dom';
import Editor from '../../common/editor/Editor';
import DropzoneArea from '../../common/DropzoneArea';
import {useTagsQuery} from '../../../api/tags/queries';
import UploadImagesComponent from './UploadImagesComponent';
import {useForm} from '@mantine/form';
import {ArrowBackUp, Check, DeviceFloppy, X} from '../../../assets/Icons';
import {useGetLocations} from '../../../api/countries/queries';
import {useMutationUpdateArticle} from "../../../api/articles/mutations";
import {useOneArticleQuery} from "../../../api/articles/queries";
import {isEmptyArray, isNullOrUndefined} from "../../../utils/primitive-checks";

function ArticleUpdate() {
  let {id} = useParams();
  const openRef = useRef<any>();
  const navigate = useNavigate();

  const [editorContent, setEditorContent] = useState<string>('');
  const [oldImages, setOldImages] = useState<any[]>([]);
  const [newImages, setNewImages] = useState<any[]>([]);
  const [tags, setTags] = useState<any>([]);
  const [oldTitleImage, setOldTitleImage] = useState<any>(null);
  const [file, setFile] = useState<any>(null);
  const [editorImages, setEditorImages] = useState<any>([])
  const [initEditorContent, setInitEditorContent] = useState<boolean>(false)

  const {data: dbTags} = useTagsQuery({});
  const {data: dbArticle, refetch: refetchArticle, isLoading: isLoadingArticle} = useOneArticleQuery({id});
  const {data: dbCountries} = useGetLocations({})

  useEffect(() => {
    refetchArticle()
  }, [initEditorContent])

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      tags: [],
      countries: []
    },
    validate: {
      title: (value) => {
        if (value?.trim().length <= 8) return 'Title should have at least 8 letters!'
      },
      description: (value) => {
        if (value?.trim().length <= 8) return 'Description should have at least 8 letters!'
      },
      countries: (value) => {
        if (value.length == 0) return 'Add at least one country!'
      }
    }
  });

  useEffect(() => {
    reset()
  }, [dbArticle])

  const reset = () => {
    setInitEditorContent(((prev: boolean) => !prev))
    if (dbArticle) {
      form.setFieldValue('title', dbArticle.title);
      form.setFieldValue('description', dbArticle.description);
      form.setFieldValue('tags', dbArticle.tagList);
      form.setFieldValue('countries', dbArticle?.countries?.map((item: any) => item.name))
      setNewImages([]);
      setOldImages(dbArticle?.images);
      setEditorContent(dbArticle?.body);
      setOldTitleImage(dbArticle.primaryImage);
    }
  };

  const handlerRemoveOldImage = (name: string, id: any) => {
    if (oldTitleImage == name) {
      handlerRemovePrimaryImage()
    }
    setOldImages(oldImages.filter((item: any) => item.id != id || item.name != name));
  }

  const handlerRemoveNewImage = (name: string) => {
    if (file?.name == name) {
      handlerRemovePrimaryImage()
    }
    setNewImages(newImages.filter((item: any) => item.name != name));
  }
  const handlerRemoveUnusedEditorImages = async () => {
    // const allImages: any = editorContent
    //   ?.match(/http:\/\/localhost([^"]*)/g)
    //   ?.map((item: any) => item.split('/')[item.split('/').length - 1])
    //
    // if (editorImages) {
    //   let imagesToRemove: string[] = editorImages.filter((image: string) => !allImages?.includes(image))
    //   if (imagesToRemove) {
    //     await removeFiles(imagesToRemove)
    //   }
    //   imagesToRemove = []
    //   setEditorImages([])
    // }
  }

  const {mutate: mutateUserUpdate, isLoading} = useMutationUpdateArticle({
    id,
    onSuccessEvent: handlerRemoveUnusedEditorImages
  });

  const handlerUpdate = (data: typeof form.values) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('body', editorContent);
    formData.append('isPrimaryImage', (!!file).toString());
    formData.append('oldPrimaryImage', oldTitleImage);

    if (!isNullOrUndefined(data) && !isEmptyArray(data.tags)) {
      data.tags.forEach((tag: string) => formData.append('tagList[]', tag))
    }

    if (!isNullOrUndefined(oldImages) && !isEmptyArray(oldImages)) {
      oldImages.forEach((image: any) => formData.append('oldImages[]', image.name))
    }

    if (!isNullOrUndefined(file)) {
      formData.append('images[]', file);
    }

    if (!isNullOrUndefined(newImages) && !isEmptyArray(newImages)) {
      newImages.forEach((image: any) => formData.append('images[]', image))
    }

    if (!isNullOrUndefined(data) && !isEmptyArray(data?.countries)) {
      data.countries.forEach((country: string) => formData.append('countries[]', country))
    }

    mutateUserUpdate(formData);
    // setNewImages([])
    // setFile(null)
  };

  const handlerRemovePrimaryImage = () => {
    setNewImages(newImages.filter((item: any) => (item.name != oldTitleImage) && (item.name != file?.name)))
    setOldImages(oldImages.filter((item: any) => (item.name != oldTitleImage) && (item.name != file?.name)))
    setFile(null);
    setOldTitleImage(null);
    openRef.current.value = '';
  };

  useEffect(() => {
    setInitEditorContent(((prev: boolean) => !prev))

    refetchArticle();
  }, [id]);

  const handlerSetTitleImage = (e: any) => {
    if (newImages.find((image: any) => image.name == e.target.files[0].name) != undefined) {
      handlerRemoveNewImage(e.target.files[0].name)
      setFile(e.target.files[0])
    }
    setFile(e.target.files[0])
    setOldTitleImage(null)
  }

  return <form onSubmit={form.onSubmit(handlerUpdate)}>
    {/*<LoadingOverlay visible={isLoading}/>*/}
    <TextInput
      required
      label="Title"
      placeholder="Enter article title..."
      {...form.getInputProps('title')}
    />
    <input
      onChange={(e: any) => handlerSetTitleImage(e)}
      style={{display: 'none'}}
      ref={openRef}
      type={'file'}
    />

    {(file || oldTitleImage) && (
      <Box style={{position: 'relative'}}>
        <Image
          src={
            file
              ? URL.createObjectURL(file)
              : `${import.meta.env.VITE_STORE_AWS}` + oldTitleImage
          }
          mt={'sm'}
          mb={'sm'}
          height={150}
          radius="md"
        />

        <ActionIcon
          onClick={() => handlerRemovePrimaryImage()}
          style={{position: 'absolute', zIndex: '1', bottom: '-10px', right: '50%'}}
          radius="xl"
          variant="filled"
          color="red"
          size={22}
        >
          <X size={17}/>
        </ActionIcon>

        <Button
          style={{position: 'absolute', top: '25%', left: '44%'}}
          my={'sm'}
          variant={'light'}
          onClick={() => openRef.current.click()}
        >
          Title Image
        </Button>
      </Box>
    )}

    {!file && !oldTitleImage && (
      <Grid
        m={0}
        columns={24}
        justify="space-between"
        align="center"
      >
        {dbArticle?.primaryImage
          ? <Grid.Col pl={0} span={22}>
            <Button
              fullWidth
              my={'sm'}
              variant={'light'}
              onClick={() => openRef.current.click()}
            >
              Title Image
            </Button>
          </Grid.Col>
          : <Grid.Col pl={0} span={24}>
            <Button
              fullWidth
              my={'sm'}
              variant={'light'}
              onClick={() => openRef.current.click()}
            >
              Title Image
            </Button>
          </Grid.Col>
        }
        {dbArticle?.primaryImage &&
          <Grid.Col
            pr={0}
            span={2}
          >
            <ActionIcon
              onClick={() => setOldTitleImage(dbArticle.primaryImage)}
            >
              <ArrowBackUp/>
            </ActionIcon>
          </Grid.Col>
        }
      </Grid>
    )}

    <TextInput
      required
      label="Description"
      placeholder="Enter article description..."
      {...form.getInputProps('description')}
    />

    <MultiSelect
      mb={'lg'}
      clearButtonLabel="Clear selection"
      data={dbTags ? dbTags.map((tag: any) => tag.name) : []}
      clearable
      searchable
      creatable
      label="Tags"
      placeholder="Tags"
      {...form.getInputProps('tags')}
      getCreateLabel={(query) => `+ ${query}`}
      onCreate={(query) => setTags((current: any) => [...current, query])}
    />

    <MultiSelect
      required
      searchable
      label='Countries'
      placeholder='Enter country name...'
      data={dbCountries ? dbCountries.map((country: any) => country.name) : []}
      {...form.getInputProps('countries')}
    />

    {useMemo(() => <Editor
        value={editorContent}
        initialContent={dbArticle?.body}
        setEditorImages={setEditorImages}
        onChange={setEditorContent}
      />,
      [initEditorContent, editorImages, isLoadingArticle, dbArticle?.body])
    }

    <DropzoneArea titleImage={file} files={newImages} setFiles={setNewImages}/>

    {useMemo(() =>
      <UploadImagesComponent
        oldFiles={(oldTitleImage ? [...oldImages] : [...oldImages])}
        newFiles={(file ? [...newImages, file] : [...newImages])}
        handlerRemoveOldImage={handlerRemoveOldImage}
        handlerRemoveNewImage={handlerRemoveNewImage}
      />, [oldTitleImage, newImages, file, oldImages])}

    <Divider
      label={<Check size={17}/>}
      labelPosition="center"
      mt={'lg'}
      mb={'lg'}
      style={{width: '100%'}}
    />

    <SimpleGrid cols={2}>
      <Button
        leftIcon={<DeviceFloppy size={17}/>}
        type="submit"
      >
        UPDATE
      </Button>
      <Button
        leftIcon={<X size={17}/>}
        fullWidth
        color={'gray'}
        onClick={() => {
          reset();
          navigate('/articles/' + id);
        }}
      >
        CANCEL
      </Button>
    </SimpleGrid>
  </form>
}

export default ArticleUpdate;
