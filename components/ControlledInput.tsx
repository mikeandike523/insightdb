import { useState } from 'react';

import {
  IconButton,
  InputAdornment,
  SxProps,
  TextField,
  Theme
} from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export function useControlledInput(
  label: string,
  required: boolean,
  type: 'text' | 'number' | 'password' | 'email' | 'tel',
  initialValue = '',
  sx: SxProps<Theme> = {},
  onChange: () => void = () => {}
): [JSX.Element, string, (error: string) => void] {
  const [value, setValue] = useState<string>(initialValue);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const component =
    type === 'password' ? (
      <TextField
        fullWidth
        required={required}
        defaultValue={initialValue}
        label={label}
        type={showPassword ? 'text' : 'password'}
        error={!!error}
        helperText={error ?? undefined}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{ ...{ m: 1 }, ...sx }}
        onChange={(event) => {
          setValue(event.target.value);
          onChange();
        }}
      />
    ) : (
      <TextField
        fullWidth
        required={required}
        sx={{ ...{ m: 1 }, ...sx }}
        type={type}
        error={!!error}
        helperText={error ?? undefined}
        label={label}
        defaultValue={initialValue}
        onChange={(e) => {
          setValue(e.target.value);
          onChange();
        }}
      />
    );

  return [
    component,
    value,
    (error: string) => {
      setError(error);
    }
  ];
}
