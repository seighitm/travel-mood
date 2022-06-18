import { RichTextEditor } from '@mantine/rte';
import React, { memo, useCallback, useMemo } from 'react';
import { TypographyStylesProvider } from '@mantine/core';

const Editor = memo(({ value, onChange, setEditorImages, initialContent }: any) => {
  const handleImageUpload = useCallback(
    (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('image', file);
        fetch(`${import.meta.env.VITE_API_URL}api/upload`, {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            if (setEditorImages) {
              const imgName = result.url.split('/')[result.url.split('/').length - 1];
              setEditorImages((prev: any) => {
                return prev && prev?.length != 0 ? [...prev, imgName] : [imgName];
              });
            }
            resolve(result.url);
          })
          .catch(() => reject(new Error('Upload failed')));
      }),
    [value]
  );

  return (
    <TypographyStylesProvider mt={'md'} mb={'md'}>
      <RichTextEditor
        value={value != '<p><br></p>' && value != '' ? value : initialContent}
        onChange={onChange}
        onImageUpload={useMemo(() => handleImageUpload, [value])}
      />
    </TypographyStylesProvider>
  );
});

export default Editor;
