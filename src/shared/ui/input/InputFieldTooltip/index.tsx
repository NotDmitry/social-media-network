import Tooltip from "@mui/material/Tooltip";
import type { TooltipProps } from "@mui/material/Tooltip";
import { InfoTooltipIcon } from "@/shared/icons";
import './style.css';

type InputFieldTooltip = Omit<TooltipProps, 'children'>;

function InputFieldTooltip(props: InputFieldTooltip) {
  return (
    <Tooltip {...props}>
      <span className='input-field-tooltip-icon'>
        <InfoTooltipIcon />
      </span>
    </Tooltip>
  );
}

export default InputFieldTooltip;
