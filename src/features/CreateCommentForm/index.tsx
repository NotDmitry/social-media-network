import { useId, useState } from 'react';
import Button from '@shared/ui/Button';
import './style.css';

function CreateCommentForm() {
  const [comment, setComment] = useState('');

  const formId = useId();
  const textareaId = useId();

  function handleFormSubmission(event: React.SyntheticEvent) {
    event.preventDefault();

    if (comment.trim() === '') {
      return;
    }

    // TODO: add API logic
    console.log('Comment added: ', comment);
    setComment('');
  }

  return (
    <>
      <form className='create-comment-form' id={formId} onSubmit={handleFormSubmission}>
        <label className='create-comment-label' htmlFor={textareaId}>
          <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M15.2353 0.765364C14.7821 0.312828 14.1678 0.0586548 13.5273 0.0586548C12.8869 0.0586548 12.2726 0.312828 11.8193 0.765364L0.976677 11.608C0.666178 11.9168 0.419985 12.284 0.252342 12.6886C0.0846994 13.0931 -0.00106532 13.5268 9.98748e-06 13.9647V15.3334C9.98748e-06 15.5102 0.0702479 15.6797 0.195272 15.8048C0.320296 15.9298 0.489866 16 0.666677 16H2.03534C2.47319 16.0013 2.90692 15.9156 3.31145 15.7481C3.71597 15.5806 4.08325 15.3345 4.39201 15.024L15.2353 4.1807C15.6877 3.72749 15.9417 3.11334 15.9417 2.47303C15.9417 1.83272 15.6877 1.21857 15.2353 0.765364ZM3.44934 14.0814C3.07335 14.4549 2.56532 14.6652 2.03534 14.6667H1.33334V13.9647C1.33267 13.702 1.38411 13.4417 1.4847 13.199C1.58529 12.9563 1.73302 12.7359 1.91934 12.5507L10.148 4.32203L11.6813 5.85536L3.44934 14.0814ZM14.292 3.23803L12.6213 4.90936L11.088 3.37936L12.7593 1.70803C12.86 1.60757 12.9795 1.52792 13.111 1.47364C13.2424 1.41935 13.3833 1.39149 13.5255 1.39164C13.6678 1.3918 13.8086 1.41997 13.9399 1.47454C14.0712 1.52911 14.1905 1.60902 14.291 1.7097C14.3915 1.81038 14.4711 1.92986 14.5254 2.06132C14.5797 2.19278 14.6076 2.33365 14.6074 2.47588C14.6072 2.6181 14.5791 2.75891 14.5245 2.89025C14.4699 3.02159 14.39 3.1409 14.2893 3.24136L14.292 3.23803Z' fill='currentColor' />
          </svg>
          <span>Add a comment</span>
        </label>
        <textarea
          className='create-comment-textarea'
          id={textareaId}
          placeholder='Write description here...'
          maxLength={200}
          rows={1}
          value={comment}
          onChange={(event) => { setComment(event.target.value); }}
        />
      </form>
      <Button form={formId} type='submit'>Add a comment</Button>
    </>
  );
}

export default CreateCommentForm;
