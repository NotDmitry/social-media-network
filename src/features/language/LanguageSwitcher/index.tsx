import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  isSupportedLanguage,
  type SupportedLanguage
} from '../model';
import './style.css';

function LanguageSwitcher() {
  const { t, i18n } = useTranslation('common');
  const savedLanguage = isSupportedLanguage(i18n.resolvedLanguage) ? i18n.resolvedLanguage : DEFAULT_LANGUAGE;
  const label = t(($) => $.languages.label);
  const labelId = useId();
  const selectId = useId();

  async function handleLanguageChange(event: SelectChangeEvent<SupportedLanguage>) {
    const selectedLanguage = event.target.value;

    try {
      await i18n.changeLanguage(selectedLanguage);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <FormControl className='language-switcher' size='medium'>
      <InputLabel className='language-switcher-label' id={labelId}>
        {label}
      </InputLabel>
      <Select
        className='language-switcher-select'
        id={selectId}
        label={label}
        labelId={labelId}
        value={savedLanguage}
        onChange={(event) => void handleLanguageChange(event)}
        slotProps={{
          notchedOutline: {
            className: 'language-switcher-outline',
          }
        }}
        MenuProps={{
          slotProps: {
            paper: {
              className: 'language-switcher-menu',
            },
          },
        }}
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <MenuItem className='language-switcher-option' key={language} value={language}>
            {t(($) => $.languages[language])}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default LanguageSwitcher;
