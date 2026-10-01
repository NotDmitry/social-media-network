import Avatar from '@mui/material/Avatar';
import type { AvatarProps } from '@mui/material/Avatar';

interface UserAvatarProps extends Omit<AvatarProps, 'src' | 'children'> {
  displayName: string;
  photoUrl?: string | null;
}

function UserAvatar({ displayName, photoUrl, ...props }: UserAvatarProps) {
  return (
    <Avatar
      {...props}
      src={photoUrl ?? undefined}
    >
      {displayName.charAt(0)}
    </Avatar>
  );
}

export default UserAvatar;
