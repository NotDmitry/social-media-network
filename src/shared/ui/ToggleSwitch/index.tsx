import './style.css';

interface ToggleSwitchProps {
  label: string;
  isToggled: boolean;
  onToggle: (isToggled: boolean) => void;
}

function ToggleSwitch({ label, isToggled, onToggle }: ToggleSwitchProps) {
  return (
    <label className='toggle-switch-label'>
      <span className={`toggle-switch ${isToggled ? 'toggle-switch_toggled' : ''}`}>
        <input
          checked={isToggled}
          className='visually-hidden'
          onChange={(event) => { onToggle(event.target.checked) }}
          type='checkbox'
        />
      </span>
      <span className='toggle-switch-text'>{label}</span>
    </label>
  );
}

export default ToggleSwitch
