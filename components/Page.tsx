import { ReactNode } from 'react';

import { Box } from '@mui/material';

/** Wrapper component to establish default stylings for every nextjs page */
export default function Page({
  children
}: {
  children?: ReactNode | ReactNode[];
}) {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'auto'
      }}
    >
      {children}
    </Box>
  );
}
