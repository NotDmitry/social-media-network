export interface UserModel {
  id: string;
  fullName: string;
  username: string;
  email: string;
  description?: string;
  avatarUrl: string;
  createdAt: string;
}

// TODO: replace with ZOD runtime schema validation
export function isUserModel(value: unknown): value is UserModel {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const user = value as Record<string, unknown>;

  return (
    typeof user.id === 'string' &&
    typeof user.fullName === 'string' &&
    typeof user.username === 'string' &&
    typeof user.email === 'string' &&
    (user.description === undefined || typeof user.description === 'string') &&
    typeof user.avatarUrl === 'string' &&
    typeof user.createdAt === 'string'
  );
}
