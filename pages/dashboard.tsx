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
          }
        ]}
      >
        Lorem Ipsum
      </Navbar>
    </Page>
  );
}
