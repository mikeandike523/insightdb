import {useState, ReactNode} from 'react'

export default function useControlledInput({
    type,
    label
}:{
    type: "text" | "password" | "email" | "tel",
    label: string
}): [ReactNode, string] {
    let [value, setValue] = useState<string>("");
    let component = <div><label>{label}:&nbsp;<input type={type} defaultValue={value} onChange={e => setValue(e.target.value)}/></label></div>

    return [component, value];

}