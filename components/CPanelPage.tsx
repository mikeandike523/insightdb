import { ReactNode } from 'react';

import { Box } from '@mui/material';

import Navbar from '@/components/Navbar';
import Page from '@/components/Page';

import theme from '@/themes/default';

export default function CPanelPage({
  children
}: {
  children?: ReactNode | ReactNode[];
}) {
  return (
    <Page>
      <Navbar
        drawerLinks={[
          {
            label: 'Dashboard',
            href: '/dashboard'
          },
          {
            label: 'Overview',
            href: '/overview'
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
        <Box sx={{ boxSizing: 'border-box', padding: theme.spacing.md }}>
          {children}
        </Box>
      </Navbar>
    </Page>
  );
}
