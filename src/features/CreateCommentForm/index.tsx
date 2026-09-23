import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '@/entities/Comment/api/createComment';
import { useAlert } from '@/shared/ui/Alert/useAlert';
import Button from '@/shared/ui/Button';
import TextareaField, { type TextareaFieldStatus } from '@/shared/ui/input/TextareaField';
import { PencilIcon } from '@/shared/icons';
import { createCommentFormSchema, type CreateCommentFormFields } from './schema';
import './style.css';

interface CreateCommentFormProps {
  postId: number;
  onCommentCreated?: () => void;
}

function CreateCommentForm({ postId, onCommentCreated }: CreateCommentFormProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitted,
    },
  } = useForm<CreateCommentFormFields>({
    resolver: zodResolver(createCommentFormSchema),
    defaultValues: {
      comment: '',
    },
  });

  const {
    mutate: addComment,
    isPending: isCommentCreationPending,
  } = useMutation({
    mutationFn: (text: string) => createComment({ postId, text }),
    onSuccess: async () => {
      onCommentCreated?.();
      reset();
      await queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      showAlert('Comment successfully created', 'success');
    },
    onError: (error) => {
      showAlert('Comment creation failed', 'error');
      console.error(error);
    }
  });

  function handleFormSubmit({ comment }: CreateCommentFormFields) {
    addComment(comment);
  }

  function getTextareaFieldStatus(hasError: boolean): TextareaFieldStatus {
    return isSubmitted && hasError ? 'invalid' : 'default';
  }

  return (
    <form className='create-comment-form' onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}>
      <TextareaField
        {...register('comment')}
        label='Add a comment'
        labelIcon={<PencilIcon />}
        placeholder='Write description here...'
        status={getTextareaFieldStatus(Boolean(errors.comment))}
        errorMessage={errors.comment?.message}
        hintMessage='Max 200 characters'
        maxLength={201}
        rows={1}
        disabled={isCommentCreationPending}
      />
      <Button type='submit' disabled={isCommentCreationPending}>
        {isCommentCreationPending ? 'Adding a comment...' : 'Add a comment'}
      </Button>
    </form>
  );
}

export default CreateCommentForm;
