import Page from '@/framework/Page'
import Navbar from '@/framework/Navbar'

export default function Home(){
    return <Page>
        <Navbar>
            <Navbar.Logo src="/logo.png" width={64} height={64} />
            <Navbar.Item>
                <h1>InsightDB</h1>
            </Navbar.Item>
            <Navbar.AlignRight>
                <Navbar.AlignRight.Item>
                <button>Sign In</button>
                </Navbar.AlignRight.Item>
                <Navbar.AlignRight.Item>
                <button>Sign Up</button>
                </Navbar.AlignRight.Item>
            </Navbar.AlignRight>
        </Navbar>
    </Page>
}