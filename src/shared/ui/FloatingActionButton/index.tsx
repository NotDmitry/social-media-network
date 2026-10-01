import Fab from "@mui/material/Fab";
import type { FabProps } from "@mui/material/Fab";

type FloatingActionButtonsProps = FabProps;

function FloatingActionButton(props: FloatingActionButtonsProps) {
  return (
    <Fab {...props} />
  );
}

export default FloatingActionButton;
