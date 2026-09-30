import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '@/entities/Comment/api/deleteComment';
import { getProfileImageFallbackUrl } from '@/entities/User/utilities';
import type { UserView } from '@/entities/User/types';
import type { CommentModel } from '@/entities/Comment/types';
import { TrashIcon } from '@/shared/icons';
import { useAlert } from '@/shared/ui/Alert/useAlert';
import { getRelativeTimePresentationString } from '@/shared/utilities/time';
import './style.css';

interface CommentProps {
  author: UserView | null;
  comment: CommentModel;
  canDelete: boolean;
}

function Comment({ author, comment, canDelete }: CommentProps) {
  const { t, i18n } = useTranslation(['posts', 'common']);
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  const {
    mutate: removeComment,
    isPending: isCommentDeletionPending,
  } = useMutation({
    mutationFn: () => deleteComment(comment.id),
    onSuccess: () => {
      queryClient.setQueryData<CommentModel[]>(['comments', comment.postId], (cachedComments) => {
        if (cachedComments === undefined) {
          return cachedComments;
        }

        return cachedComments.filter((cachedComment) => cachedComment.id !== comment.id);
      });

      showAlert(t(($) => $.comment.delete.alert.success), 'success');
    },
    onError: (error) => {
      showAlert(t(($) => $.comment.delete.alert.error), 'error');
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
          src={getProfileImageFallbackUrl(canDelete, author?.profileImage)}
          alt={t(($) => $.a11y.profilePicture, {
            ns: 'common',
            name: author?.displayName ?? t(($) => $.comment.unknownAuthor),
          })}
          width={32}
          height={32}
        />
        <span className='comment-author'>{author?.displayName ?? t(($) => $.comment.unknownAuthor)}</span>
        <time
          className='comment-time'
          dateTime={comment.creationDate}
        >
          {getRelativeTimePresentationString(comment.creationDate, i18n.resolvedLanguage ?? i18n.language)}
        </time>
        {canDelete &&
          <button
            className='comment-delete-button'
            type='button'
            aria-label={t(($) => $.comment.delete.action)}
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
