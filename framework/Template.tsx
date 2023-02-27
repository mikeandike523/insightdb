import {ReactNode, CSSProperties} from 'react'

import theme from '@/themes/default'

export default function Template (
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

        },...style}}
    >
        {children}
    </div>
}