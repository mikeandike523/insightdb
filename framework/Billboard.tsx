import {CSSProperties, ReactNode} from 'react'

export default function Billboard(
{
    children,
    style={},
    innerDivStyle={}
}:{
    children?: ReactNode,
    style?: CSSProperties
    innerDivStyle?: CSSProperties
}
){
    return <div style={{...{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }, ...style}}>
        <div style={{...{}, ...innerDivStyle}}>
            {children}
        </div>
    </div>
}