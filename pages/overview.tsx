import { useState } from 'react';

import { useRouter } from 'next/router';

import { Fab, Grid, Paper, Typography } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import CPanelPage from '@/components/CPanelPage';
import { usePopoverMenu } from '@/components/PopoverMenu';

import theme from '@/themes/default';

import { Schema } from '@/utils/CYFORM';

export default function SchemaEditor() {
  const router = useRouter();

  const [schemas, setSchemas] = useState<Array<Schema>>([]);

  const handleAddSchema = () => {
    router.push('/schema-editor/New');
  };

  const handleAddTable = () => {};

  const handleAddConstraint = () => {};

  const [addMenuComponent, addButtonOnClick] = usePopoverMenu(
    [
      {
        label: 'Schema',
        onClick: handleAddSchema
      },
      {
        label: 'Table',
        onClick: handleAddTable
      },
      {
        label: 'Constraint',
        onClick: handleAddConstraint
      }
    ],
    {
      horizontal: 'right',
      vertical: 'top'
    },
    {
      horizontal: 'left',
      vertical: 'bottom'
    },
    theme.spacing.sm,
    undefined
  );

  return (
    <CPanelPage>
      <Grid container spacing={theme.spacing.lg} sx={{ width: '100%' }}>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Typography variant="h3" component="h1">
            Schemas
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Typography variant="h3" component="h1">
            Tables
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Typography variant="h3" component="h1">
            Constraints
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Paper>
            <Typography variant="body1" component="p">
              No Schemas
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Paper>
            <Typography variant="body1" component="p">
              No Tables
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Paper>
            <Typography variant="body1" component="p">
              No Constraints
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Fab
        color="primary"
        sx={{
          position: 'absolute',
          bottom: '0',
          right: 0,
          margin: theme.spacing.lg
        }}
        onClick={addButtonOnClick}
      >
        <AddIcon />
      </Fab>
      {addMenuComponent}
    </CPanelPage>
  );
}
