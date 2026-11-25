import { useState } from 'react';
import type { CurrentUserView } from '@/entities/User/types';
import CreatePostModal from './CreatePostModal';
import QuickPostForm from './QuickPostForm';

const MAX_POST_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_POST_FILE_TYPES = ['image/png', 'image/jpeg'];

interface CreatePostProps {
  currentUser: CurrentUserView;
}

function CreatePost({ currentUser }: CreatePostProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialDescription, setInitialDescription] = useState('');

  function handleQuickPostSubmit(description: string) {
    setInitialDescription(description);
    setIsModalOpen(true);
  }

  function handleModalClose() {
    setIsModalOpen(false);
  }

  return (
    <>
      <QuickPostForm currentUser={currentUser} onSubmit={handleQuickPostSubmit} />
      <CreatePostModal
        isOpen={isModalOpen}
        initialDescription={initialDescription}
        maxFileSize={MAX_POST_FILE_SIZE}
        acceptedFileTypes={ACCEPTED_POST_FILE_TYPES}
        onClose={handleModalClose}
      />
    </>
  );
}

export default CreatePost;
