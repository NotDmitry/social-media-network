import { useEffect, useId, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '@/entities/Post/api/createPost';
import { useAlert } from '@/shared/ui/Alert/useAlert';
import Button from '@/shared/ui/Button';
import { uploadImage } from '@/shared/api/uploadImage';
import { CloseIcon, FileUploadIcon, PencilIcon } from '@/shared/icons';
import TextField, { type TextFieldStatus } from '@/shared/ui/input/TextField';
import TextAreaField, { type TextareaFieldStatus } from '@/shared/ui/input/TextareaField';
import { createPostFormSchema, type CreatePostFormFields } from './schema';
import './style.css';

interface CreatePostModalProps {
  isOpen: boolean;
  initialDescription: string;
  maxFileSize: number;
  acceptedFileTypes: string[];
  onClose: () => void;
}

function CreatePostModal({
  isOpen,
  initialDescription,
  maxFileSize,
  acceptedFileTypes,
  onClose,
}: CreatePostModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileErrorMessage, setSelectedFileErrorMessage] = useState<string | null>(null);
  const dialogElementRef = useRef<HTMLDialogElement | null>(null);
  const formId = useId();
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitted,
    },
  } = useForm<CreatePostFormFields>({
    resolver: zodResolver(createPostFormSchema),
    defaultValues: {
      title: '',
      description: initialDescription,
    },
  });

  const {
    mutate: addPost,
    isPending: isPostCreationPending,
  } = useMutation({
    mutationFn: createNewPost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['posts'] });

      handleModalClose();
      showAlert('Post successfully created', 'success');
    },
    onError: (error) => {
      showAlert('Post creation failed', 'error');
      console.error(error);
    },
  });

  async function createNewPost({ title, description }: CreatePostFormFields) {
    let imageUrl: string | undefined;

    if (selectedFile !== null) {
      const { url } = await uploadImage(selectedFile);
      imageUrl = url;
    }

    return createPost({
      title,
      content: description,
      image: imageUrl,
    });
  }

  function handleModalClose() {
    setSelectedFile(null);
    setSelectedFileErrorMessage(null);
    onClose();
  }

  function handleModalCancel(event: React.SyntheticEvent<HTMLDialogElement>) {
    if (isPostCreationPending) {
      event.preventDefault();
    }
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget && !isPostCreationPending) {
      handleModalClose();
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    handleFileSelect(event.currentTarget.files);
    event.currentTarget.value = '';
  }

  function handleFileDrop(event: React.DragEvent<HTMLLabelElement>) {
    if (event.type !== 'drop') {
      return;
    }

    event.preventDefault();
    handleFileSelect(event.dataTransfer.files);
  }

  function handleFileDragOver(event: React.DragEvent<HTMLLabelElement>) {
    if (event.type !== 'dragover') {
      return;
    }

    event.preventDefault();
  }

  function handleFileSelect(files: FileList | null) {
    if (isPostCreationPending) {
      return;
    }

    const file = files?.[0];

    if (!file) {
      setSelectedFile(null);
      setSelectedFileErrorMessage(null);

      return;
    }

    if (!acceptedFileTypes.includes(file.type)) {
      setSelectedFile(null);
      setSelectedFileErrorMessage('Unsupported file format');

      return;
    }

    if (file.size > maxFileSize) {
      setSelectedFile(null);
      setSelectedFileErrorMessage('The file is too large');

      return;
    }

    setSelectedFile(file);
    setSelectedFileErrorMessage(null);
  }

  function handleFormSubmit(createPostFields: CreatePostFormFields) {
    if (selectedFileErrorMessage === null) {
      addPost(createPostFields)
    }
  }

  function getTextFieldStatus(hasError: boolean): TextFieldStatus {
    if (!isSubmitted) {
      return 'default';
    }

    return hasError ? 'invalid' : 'valid';
  }

  function getTextareaFieldStatus(hasError: boolean): TextareaFieldStatus {
    return isSubmitted && hasError ? 'invalid' : 'default';
  }

  useEffect(() => {
    if (isOpen) {
      reset({
        title: '',
        description: initialDescription,
      });
      dialogElementRef.current?.showModal();
    } else {
      dialogElementRef.current?.close();
    }
  }, [isOpen, initialDescription, reset]);

  return (
    <dialog
      className='create-post-modal'
      ref={dialogElementRef}
      onClose={handleModalClose}
      onClick={handleBackdropClick}
      onCancel={handleModalCancel}
    >
      <div className='create-post-modal-content'>
        <header className='create-post-modal-header'>
          <p className='create-post-modal-title'>Create a new post</p>
          <button
            className='create-post-modal-close-button'
            type='button'
            onClick={handleModalClose}
            disabled={isPostCreationPending}
          >
            <CloseIcon className='create-post-modal-close-icon' />
          </button>
        </header>
        <form
          className='create-post-form'
          id={formId}
          onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}
        >
          <TextField
            {...register('title')}
            label='Post Title'
            labelIcon={<PencilIcon />}
            placeholder='Enter post title'
            status={getTextFieldStatus(Boolean(errors.title))}
            errorMessage={errors.title?.message}
            maxLength={81}
            type='text'
            disabled={isPostCreationPending}
          />
          <TextAreaField
            {...register('description')}
            label='Description'
            labelIcon={<PencilIcon />}
            placeholder='Write description here...'
            status={getTextareaFieldStatus(Boolean(errors.description))}
            errorMessage={errors.description?.message}
            hintMessage='Max 500 characters'
            maxLength={501}
            rows={1}
            disabled={isPostCreationPending}
          />
          <label
            className={`create-post-file-dropzone ${selectedFileErrorMessage ?
              'create-post-file-dropzone_invalid' : ''}`}
            onDragOver={handleFileDragOver}
            onDrop={handleFileDrop}
          >
            <input
              type='file'
              className='visually-hidden'
              accept={acceptedFileTypes.join(',')}
              onChange={handleFileChange}
              disabled={isPostCreationPending}
            />
            <FileUploadIcon className='create-post-file-dropzone-icon' />
            <span className='create-post-file-dropzone-text'>
              <span className='create-post-file-dropzone-hint'>
                {selectedFile?.name ?? 'Select a file or drag and drop here'}
              </span>
              <span
                className={`create-post-file-dropzone-constraint ${selectedFileErrorMessage ?
                  'create-post-file-dropzone-constraint_invalid' : ''}`}
              >
                {selectedFileErrorMessage ?? 'JPG or PNG, no more than 10MB'}
              </span>
            </span>
          </label>
        </form>
        <div className='create-post-form-actions'>
          <Button
            type='submit'
            form={formId}
            disabled={isPostCreationPending || selectedFileErrorMessage !== null}
          >
            {isPostCreationPending ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </div>
    </dialog>
  );
}

export default CreatePostModal;
