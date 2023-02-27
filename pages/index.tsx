import {useRouter} from 'next/router'

import Page from '@/framework/Page'
import Billboard from '@/framework/Billboard'
import HStack from '@/framework/HStack'

import defaultTheme from '@/themes/default'

export default function Home() {

  let router = useRouter()

  return <Page>
    <Billboard>
      <h1>InsightDB</h1>
      <i>Data Storage with <strong>Purpose</strong></i>
      <HStack>
        <button style={{
          marginRight: defaultTheme.spacing.sm
        }} onClick={()=>router.push("/signin")}>Sign In</button>
        <button onClick={()=>router.push("/signup")}>Sign Up</button>
      </HStack>
    </Billboard>

  </Page>
}
