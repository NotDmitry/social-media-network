import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '@/entities/Comment/api/createComment';
import { useAlert } from '@/shared/ui/Alert/useAlert';
import Button from '@/shared/ui/Button';
import TextareaField from '@/shared/ui/input/TextareaField';
import { PencilIcon } from '@/shared/icons';
import './style.css';

interface CreateCommentFormProps {
  postId: number;
  onCommentCreated?: () => void;
}

function CreateCommentForm({ postId, onCommentCreated }: CreateCommentFormProps) {
  const [comment, setComment] = useState('');
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();

  const {
    mutate: addComment,
    isPending: isCommentCreationPending,
  } = useMutation({
    mutationFn: (text: string) => createComment({ postId, text }),
    onSuccess: async () => {
      onCommentCreated?.();
      setComment('');
      await queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      showAlert('Comment successfully created', 'success');
    },
    onError: (error) => {
      showAlert('Comment creation failed', 'error');
      console.error(error);
    }
  });

  function handleFormSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedComment = comment.trim();

    if (trimmedComment === '') {
      return;
    }

    addComment(comment);
  }

  function handleCommentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setComment(event.currentTarget.value);
  }

  return (
    <form className='create-comment-form' onSubmit={handleFormSubmit}>
      <TextareaField
        label='Add a comment'
        labelIcon={<PencilIcon />}
        placeholder='Write description here...'
        maxLength={200}
        rows={1}
        value={comment}
        disabled={isCommentCreationPending}
        onChange={handleCommentChange}
      />
      <Button type='submit' disabled={isCommentCreationPending}>
        {isCommentCreationPending ? 'Adding a comment...' : 'Add a comment'}
      </Button>
    </form>
  );
}

export default CreateCommentForm;
