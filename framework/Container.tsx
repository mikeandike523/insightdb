import {ReactNode, CSSProperties} from 'react'

import theme from '@/themes/default'

export default function Container (
{
    style={},
    children
}:
{
    style?:CSSProperties,
    children?:ReactNode | ReactNode[]
}
) {
    return <div
        style={{...{
            width: "100%",
            padding: theme.spacing.md,
            boxSizing: "border-box",
        },...style}}
    >
        {children}
    </div>
}