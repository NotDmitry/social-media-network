import './style.css';

interface ToggleSwitchProps {
  ariaLabel?: string;
  isToggled: boolean;
  onToggle: (isToggled: boolean) => void;
}

function ToggleSwitch({ isToggled, onToggle, ariaLabel = 'Switch button state' }: ToggleSwitchProps) {
  return (
    <label className={`toggle-switch ${isToggled ? 'toggle-switch_toggled' : ''}`}>
      <input
        aria-label={ariaLabel}
        checked={isToggled}
        className='toggle-switch-input'
        onChange={(event) => { onToggle(event.target.checked) }}
        type='checkbox'
      />
    </label>
  );
}

export default ToggleSwitch
