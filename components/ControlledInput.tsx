import {useState} from 'react'

import {
    TextField,
    InputAdornment,
    IconButton,
    SxProps,
    Theme
} from '@mui/material'

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export function useControlledInput(
    label: string,
    required: boolean,
    type: "text" | "number" | "password" | "email" | "tel",
    initialValue: string = "",
    sx: SxProps<Theme> = {},
    onChange: ()=>void = ()=>{}
) : [JSX.Element, string] {
    let [value, setValue] = useState<string>(initialValue)
    let [showPassword, setShowPassword] = useState<boolean>(false)
    let component = (type==="password")?<TextField fullWidth required={required}
        defaultValue={initialValue}
        label={label} 
        type={showPassword? "text" : "password"}
        InputProps={{
            endAdornment: (<InputAdornment position="end">
                <IconButton onClick={()=>{
                    setShowPassword(!showPassword)
                }}>
                    {
                        showPassword? <VisibilityOff /> : <Visibility />
                    }
                </IconButton>
            </InputAdornment>)
        }}
        sx={sx}
        onChange={(event)=>{
            setValue(event.target.value)
            onChange()
        }}
    />:<TextField fullWidth required={required} sx={sx} type={type} label={label} defaultValue={initialValue} onChange={(e) => {
        setValue(e.target.value)
        onChange()
    }} />

    return [component, value]
}