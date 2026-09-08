import { TrashIcon } from '@shared/icons';

import './style.css';

interface CommentProps {
  text: string;
  canDelete: boolean;
}

function Comment({ text, canDelete }: CommentProps) {

  function handleDeleteClick() {
    // TODO: add logic
    console.log('Deleting comment...');
  }

  return (
    <article className='comment'>
      <p className='comment-text'>{text}</p>
      {canDelete &&
        <button
          className='comment-delete-button'
          type='button'
          aria-label='Delete comment'
          onClick={handleDeleteClick}
        >
          <TrashIcon className='comment-delete-icon' />
        </button>
      }
    </article>
  );
}

export default Comment;
