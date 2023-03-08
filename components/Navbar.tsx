import { useRouter } from 'next/router';

import { ReactNode, useState } from 'react';

import {
    AppBar,
    Box,
    Breadcrumbs,
    Button,
    Divider,
    Drawer,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemButton,
    Toolbar,
    Typography
} from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';

import { useGlobalState } from '@/utils/GlobalState';
import { drawerTransitionCSS } from '@/utils/MUIUtils';

import theme from '@/themes/default';

import { usePopoverMenu } from './PopoverMenu';

export default function Navbar({
  children,
  drawerLinks
}: {
  children?: ReactNode | ReactNode[];
  drawerLinks: {
    label: string;
    href: string;
  }[];
}) {
  const router = useRouter();

  const path = router.asPath.replace(/^\//g, '').replace(/\/$/g, '');

  const breadcrumbs = path.split('/');

  const globalState = useGlobalState();

  const user: any = globalState.get().user;

  const greeting = `${user.title} ${user.name}`;

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const drawerWidth = theme.navbar.drawer.width;

  const [accountPopoverMenu, accountPopoverMenuOnClick] = usePopoverMenu(
    [
      {
        label: 'Profile',
        onClick: '/profile'
      },
      {
        label: 'Account',
        onClick: '/account'
      },
      {
        label: 'Sign Out',
        onClick: '/signout'
      }
    ],
    {
      vertical: 'bottom',
      horizontal: 'right'
    },
    undefined,
    undefined,
    theme.spacing.sm
  );

  return (
    <>
      <AppBar
        position="static"
        style={{
          marginLeft: drawerOpen ? drawerWidth : 0,
          ...drawerTransitionCSS
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => {
              setDrawerOpen(!drawerOpen);
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Button
              color="inherit"
              onClick={() => {
                router.push('/');
              }}
            >
              <Typography variant="h6" component="span">
                InsightDB
              </Typography>
            </Button>
            <Breadcrumbs color="inherit">
              <div key="spacer"></div> {/* Used to create leading slash*/}
              {breadcrumbs.map((item, index, arr) => {
                return (
                  <Link
                    key={index}
                    underline="hover"
                    href={'/' + arr.slice(0, index + 1).join('/')}
                    color="inherit"
                  >
                    {item}
                  </Link>
                );
              })}
            </Breadcrumbs>
          </Box>
          <Button
            sx={{ lineHeight: '100%' }}
            color="inherit"
            startIcon={<AccountCircleIcon />}
            onClick={accountPopoverMenuOnClick}
          >
            {greeting}
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        elevation={0}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
        }}
        anchor="left"
      >
        <Box sx={{ width: drawerWidth }}>
          <List>
            {drawerLinks.map((link, index) => {
              return link.href === '__divider__' ? (
                <Divider />
              ) : (
                <ListItem
                  key={index}
                  disablePadding
                  onClick={() => {
                    router.push(link.href);
                  }}
                >
                  <ListItemButton>{link.label}</ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
      <div
        style={{
          marginLeft: drawerOpen ? drawerWidth : '0px',
          ...drawerTransitionCSS
        }}
      >
        {children}
      </div>
      {accountPopoverMenu}
    </>
  );
}
