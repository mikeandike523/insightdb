import {CSSProperties, ReactNode} from 'react'

import {Roboto} from '@next/font/google'

const roboto = Roboto({
    weight: "400",
    style: "normal",
    subsets: ["latin", "latin-ext"]
})

export default function Page({
    children,
    style={}
}:{
    children?:ReactNode|ReactNode[]
    style?:CSSProperties
}){
    return <div className={roboto.className} style={{...{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'auto',
    }, ...style}}>
        {children}
    </div>
}