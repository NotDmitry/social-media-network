import MuiIconButton from '@mui/material/IconButton';
import type { IconButtonProps as MuiIconButtonProps } from '@mui/material/IconButton';

type IconButtonProps = MuiIconButtonProps;

function IconButton(props: IconButtonProps) {
  return <MuiIconButton {...props} />;
}

export default IconButton;
