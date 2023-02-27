import {ReactNode, CSSProperties} from 'react'

import Image from 'next/image'

import Container from '@/framework/Container'

import theme from '@/themes/default'

function NavbarItem({children, style={}}:{children?:ReactNode|ReactNode,style?:CSSProperties}) {
    return <div style={{...{
        marginRight: theme.spacing.sm
    },...style}}>
        {children}
    </div>
}

function Logo({src, width, height}:{src:string, width?:number, height?:number}) {

    return <Image src={src} alt="Navbar Logo"  width={width} height={height} style={{
        marginRight:theme.spacing.md,
        width: width,
        height: height
    }}/>
}

function NavbarAlignRight({children, style={}}:{children?:ReactNode|ReactNode,style?:CSSProperties}){
    return <div style={{...{
        marginLeft: "auto",
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },...style}}>
        {children}
    </div>
}

function NavbarAlignRightItem({children, style={}}:{children?:ReactNode|ReactNode,style?:CSSProperties}) {
    return <div style={{...{
        marginLeft: theme.spacing.sm
    },...style}}>
        {children}
    </div>
}

export default function Navbar (
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
            width:"100%",
            background:theme.colors.background.light,
            position:"sticky",
            top:0,
            left:0,
            borderBottom:theme.spacing.xs+" solid "+theme.colors.border.light
        },...style}}
    >   
        <Container style={{
            width: "100%",
            display:"flex",
            flexDirection:"row",
            alignItems:"center"
        }}>
            {children}
        </Container>
    </div>
}

Navbar.Item = NavbarItem
Navbar.Logo = Logo
Navbar.AlignRight = NavbarAlignRight
NavbarAlignRight.Item = NavbarAlignRightItem