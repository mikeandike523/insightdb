import { MouseEvent, useState } from 'react';

import { useRouter } from 'next/router';

import { Menu, MenuItem } from '@mui/material';

export function usePopoverMenu(
  entries: {
    label: string;
    onClick: (() => void) | string;
  }[],
  anchorOrigin?: {
    vertical: number | 'top' | 'bottom' | 'center';
    horizontal: number | 'left' | 'right';
  },
  transformOrigin?: {
    vertical: number | 'top' | 'bottom' | 'center';
    horizontal: number | 'left' | 'right';
  }
): [JSX.Element, (evt: MouseEvent<HTMLElement>) => void] {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return [
    <Menu
      key={0}
      anchorEl={anchorEl}
      anchorOrigin={
        anchorOrigin ?? {
          vertical: 'bottom',
          horizontal: 'right'
        }
      }
      keepMounted
      open={anchorEl !== null}
      transformOrigin={
        transformOrigin ?? {
          vertical: 'top',
          horizontal: 'right'
        }
      }
      onClose={() => {
        setAnchorEl(null);
      }}
    >
      {entries.map((entry, index) => {
        return (
          <MenuItem
            key={index}
            onClick={
              typeof entry.onClick === 'string'
                ? () => router.push(entry.onClick as string)
                : entry.onClick
            }
          >
            {entry.label}
          </MenuItem>
        );
      })}
    </Menu>,
    (evt: MouseEvent<HTMLElement>) => {
      setAnchorEl(evt.currentTarget);
    }
  ];
}
