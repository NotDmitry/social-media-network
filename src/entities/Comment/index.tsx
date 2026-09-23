import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '@/entities/Comment/api/deleteComment';
import type { CommentModel } from '@/entities/Comment/types';
import { TrashIcon } from '@/shared/icons';
import { useAlert } from '@/shared/ui/Alert/useAlert';
import './style.css';

interface CommentProps {
  comment: CommentModel;
  canDelete: boolean;
}

function Comment({ comment, canDelete }: CommentProps) {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  const {
    mutate: removeComment,
    isPending: isCommentDeletionPending,
  } = useMutation({
    mutationFn: () => deleteComment(comment.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['comments', comment.postId] });

      showAlert('Comment successfully deleted', 'success');
    },
    onError: (error) => {
      showAlert('Comment deletion failed', 'error');
      console.error(error);
    },
  });


  function handleDeleteClick() {
    removeComment();
  }

  return (
    <article className='comment'>
      <p className='comment-text'>{comment.text}</p>
      {canDelete &&
        <button
          className='comment-delete-button'
          type='button'
          aria-label='Delete comment'
          onClick={handleDeleteClick}
          disabled={isCommentDeletionPending}
        >
          <TrashIcon className='comment-delete-icon' />
        </button>
      }
    </article>
  );
}

export default Comment;
