import { useEffect, useId, useRef } from 'react';
import Button from '@/shared/ui/Button';
import { CloseIcon, FileUploadIcon, PencilIcon } from '@/shared/icons';
import TextField from '@/shared/ui/input/TextField';
import TextAreaField from '@/shared/ui/input/TextareaField';
import './style.css';

interface CreatePostModalProps {
  isOpen: boolean;
  initialDescription: string;
  onClose: () => void;
}

function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const dialogElementRef = useRef<HTMLDialogElement | null>(null);
  const formId = useId();

  function handleModalClose() {
    onClose();
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  useEffect(() => {
    if (isOpen) {
      dialogElementRef.current?.showModal();
    } else {
      dialogElementRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog
      className='create-post-modal'
      ref={dialogElementRef}
      onClick={handleBackdropClick}
    >
      <div className='create-post-modal-content'>
        <header className='create-post-modal-header'>
          <p className='create-post-modal-title'>Create a new post</p>
          <button
            className='create-post-modal-close-button'
            type='button'
            onClick={handleModalClose}
          >
            <CloseIcon className='create-post-modal-close-icon' />
          </button>
        </header>
        <form className='create-post-form' id={formId}>
          <TextField
            label='Post Title'
            labelIcon={<PencilIcon />}
            placeholder='Enter post title'
            type='text'
          />
          <TextAreaField
            label='Description'
            labelIcon={<PencilIcon />}
            placeholder='Write description here...'
          />
          <div className='create-post-file-dropzone'>
            <FileUploadIcon className='create-post-file-dropzone-icon' />
            <div className='create-post-file-dropzone-text'>
              <p className='create-post-file-dropzone-hint'>
                Select a file or drag and drop here
              </p>
              <p className='create-post-file-dropzone-constraint'>
                JPG or PNG, no more than 10MB
              </p>
            </div>
          </div>
        </form>
        <div className='create-post-form-actions'>
          <Button type='submit' form={formId}>Create</Button>
        </div>
      </div>
    </dialog>
  );
}

export default CreatePostModal;
