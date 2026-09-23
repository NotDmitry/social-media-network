import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '@/entities/Comment/api/deleteComment';
import type { UserView } from '@/entities/User/types';
import type { CommentModel } from '@/entities/Comment/types';
import { TrashIcon } from '@/shared/icons';
import { useAlert } from '@/shared/ui/Alert/useAlert';
import { getRelativeTimePresentationString } from '@/shared/utilities/time';
import './style.css';

interface CommentProps {
  author: UserView
  comment: CommentModel;
  canDelete: boolean;
}

function Comment({ author, comment, canDelete }: CommentProps) {
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
      <header className='comment-header'>
        <img
          className='avatar comment-avatar'
          src={author.profileImage ?? undefined}
          alt={`Profile picture of ${author.displayName}`}
          width={32}
          height={32}
        />
        <span className='comment-author'>{author.displayName}</span>
        <time
          className='comment-time'
          dateTime={comment.creationDate}
        >
          {getRelativeTimePresentationString(comment.creationDate)}
        </time>
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
      </header>
      <p className='comment-text'>{comment.text}</p>
    </article>
  );
}

export default Comment;
