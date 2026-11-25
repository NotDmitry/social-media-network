import Tooltip from "@mui/material/Tooltip";
import type { TooltipProps } from "@mui/material/Tooltip";
import { InfoTooltipIcon } from "@/shared/icons";
import './style.css';

type InputFieldTooltip = Omit<TooltipProps, 'children'>;

function InputFieldTooltip(props: InputFieldTooltip) {
  return (
    <Tooltip {...props}>
      <button className='input-field-tooltip-icon' type='button'>
        <InfoTooltipIcon />
      </button>
    </Tooltip>
  );
}

export default InputFieldTooltip;
