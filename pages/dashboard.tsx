import Navbar from '@/components/Navbar';
import Page from '@/components/Page';

export default function Dashboard() {
  return (
    <Page>
      <Navbar
        drawerLinks={[
          {
            label: 'Dashboard',
            href: '/dashboard'
          },
          {
            label: 'Schema Designer',
            href: '/schema-designer'
          },
          ...(process.env.NODE_ENV === 'development'
            ? [
                {
                  label: '',
                  href: '__divider__'
                },

                {
                  label: 'Neo4j Console',
                  href: '/testing/neo4j-console'
                },
                {
                  label: 'View Session Data',
                  href: '/testing/me'
                }
              ]
            : [])
        ]}
      >
        Lorem Ipsum
      </Navbar>
    </Page>
  );
}
