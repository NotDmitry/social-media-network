// import { useEffect, useId, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { useAlert } from '@/shared/ui/Alert/useAlert';
// import Button from '@/shared/ui/Button';
// import { CloseIcon } from '@/shared/icons';
// import PasswordField from '@/shared/ui/input/PasswordField';
// import type { TextFieldStatus } from '@/shared/ui/input/TextField';
// import './style.css';
// import type { ConfirmPasswordField } from './schema';
// import { confirmPasswordSchema } from './schema';

// interface PasswordConfirmationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onPasswordChange: (password: string) => void;
// }

// function PasswordConfirmationModal({ isOpen, onClose, onPasswordChange }: PasswordConfirmationModalProps) {
//   const { t } = useTranslation('authentication');
//   const dialogElementRef = useRef<HTMLDialogElement | null>(null);
//   const formId = useId();
//   const { showAlert } = useAlert();

//   const {
//     register,
//     handleSubmit,
//     formState: {
//       errors,
//       isSubmitted,
//     },
//   } = useForm<ConfirmPasswordField>({
//     resolver: zodResolver(confirmPasswordSchema),
//     defaultValues: '',
//   });

//   function handleModalClose() {
//     onClose();
//   }

//   // function handleModalCancel(event: React.SyntheticEvent<HTMLDialogElement>) {
//   //   if (isPostCreationPending) {
//   //     event.preventDefault();
//   //   }
//   // }

//   function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
//     // if (event.target === event.currentTarget && !isPostCreationPending) {
//     if (event.target === event.currentTarget) {
//       handleModalClose();
//     }
//   }

//   function handleFormSubmit(currentPassword: string) {
//     onPasswordChange(currentPassword);
//   }

//   function getFieldStatus(hasError: boolean): TextFieldStatus {
//     if (!isSubmitted) {
//       return 'default';
//     }

//     return hasError ? 'invalid' : 'valid';
//   }

//   useEffect(() => {
//     if (isOpen) {
//       dialogElementRef.current?.showModal();
//     } else {
//       dialogElementRef.current?.close();
//     }
//   }, [isOpen]);

//   return (
//     <dialog
//       className='create-post-modal'
//       ref={dialogElementRef}
//       onClose={handleModalClose}
//       onClick={handleBackdropClick}
//     // onCancel={handleModalCancel}
//     >
//       <div className='create-post-modal-content'>
//         <header className='create-post-modal-header'>
//           <p className='create-post-modal-title'>{t(($) => $.createPost.title)}</p>
//           <button
//             className='create-post-modal-close-button'
//             type='button'
//             onClick={handleModalClose}
//           >
//             <CloseIcon className='create-post-modal-close-icon' />
//           </button>
//         </header>
//         <form
//           className='create-post-form'
//           id={formId}
//           onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}
//         >
//           <PasswordField
//             {...register('password')}
//             label={t(($) => $.signIn.input.password.label)}
//             autoComplete='current-password'
//             placeholder={t(($) => $.signIn.input.password.placeholder)}
//             status={getFieldStatus(Boolean(errors.password))}
//             errorMessage={errors.password?.message}
//             tooltipMessage={t(($) => $.signIn.input.password.tooltip)}
//             showVisibilityToggle={true}
//           />
//         </form>
//         <div className='create-post-form-actions'>
//           <Button
//             type='submit'
//             form={formId}
//             disabled={isPostCreationPending || selectedFileErrorMessage !== null}
//           >
//             {isPostCreationPending
//               ? t(($) => $.createPost.button.pending)
//               : t(($) => $.createPost.button.default)
//             }
//           </Button>
//         </div>
//       </div>
//     </dialog>
//   );
// }

// export default PasswordConfirmationModal;
