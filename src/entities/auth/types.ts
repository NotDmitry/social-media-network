export interface SignInPayload {
  email: string,
  password: string;
}

export interface SignUpPayload extends SignInPayload {
  fullName: string;
  repeatPassword: string;
}
