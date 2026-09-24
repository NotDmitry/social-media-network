import { useEffect, useId, useRef, useState } from 'react';
import Button from '@/shared/ui/Button';
import { CloseIcon, FileUploadIcon, PencilIcon } from '@/shared/icons';
import TextField from '@/shared/ui/input/TextField';
import TextAreaField from '@/shared/ui/input/TextareaField';
import './style.css';

interface CreatePostModalProps {
  isOpen: boolean;
  initialDescription: string;
  maxFileSize: number;
  acceptedFileTypes: string[];
  onClose: () => void;
}

function CreatePostModal({ isOpen, maxFileSize, acceptedFileTypes, onClose }: CreatePostModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileErrorMessage, setSelectedFileErrorMessage] = useState<string | null>(null);
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
          <Button type='submit' form={formId}>Create</Button>
        </div>
      </div>
    </dialog>
  );
}

export default CreatePostModal;
