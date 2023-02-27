import {CSSProperties, ReactNode} from 'react'

export default function HStack({
    children,
    alignCenter=false,
    style={}
}:{
    children?: ReactNode | ReactNode[]
    alignCenter?: boolean,
    style?: CSSProperties
}){
    return <div style={{...{
        display: 'flex',
        flexDirection: 'row',
        alignItems: alignCenter? 'center' : 'flex-start'
    }, ...style}}>
        {children}
    </div>
}