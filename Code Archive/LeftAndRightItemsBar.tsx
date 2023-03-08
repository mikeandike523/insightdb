import { ReactNode } from 'react';

import { Box } from '@mui/material';

import theme from '@/themes/default';

export default function LeftAndRightItemsBar({
  leftContent,
  rightContent,
  padding = theme.spacing.sm,
  spacing = theme.spacing.sm
}: {
  leftContent?: ReactNode[];
  rightContent?: ReactNode[];
  padding?: number | string;
  spacing?: number | string;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: padding,
        spacing: spacing
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'start',
          spacing: spacing
        }}
      >
        {leftContent ??
          [].map((item, index) => {
            return <span key={index}>{item}</span>;
          })}
      </Box>
      <Box
        sx={{
          marginLeft: 'auto',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'end',
          spacing: spacing
        }}
      >
        {rightContent ??
          [].map((item, index) => {
            return <span key={index}>{item}</span>;
          })}
      </Box>
    </Box>
  );
}
