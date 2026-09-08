import { useState } from 'react';

import Button from '@/shared/ui/Button';
import TextareaField from '@/shared/ui/input/TextareaField';
import { PencilIcon } from '@/shared/icons';

import './style.css';

function CreateCommentForm() {
  const [comment, setComment] = useState('');

  function handleFormSubmission(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (comment.trim() === '') {
      return;
    }

    // TODO: add API logic
    console.log('Comment added: ', comment);
    setComment('');
  }

  return (
    <form className='create-comment-form' onSubmit={handleFormSubmission}>
      <TextareaField
        label='Add a comment'
        labelIcon={<PencilIcon />}
        placeholder='Write description here...'
        maxLength={200}
        rows={1}
        value={comment}
        onChange={(event) => { setComment(event.target.value); }}
      />
      <Button type='submit'>Add a comment</Button>
    </form>
  );
}

export default CreateCommentForm;
