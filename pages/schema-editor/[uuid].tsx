import { useState } from 'react';

import { useRouter } from 'next/router';

import { Box, Fab, TextField, Typography } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';

import SaveIcon from '@mui/icons-material/Save';

import CPanelPage from '@/components/CPanelPage';

export default function SchemaEditor() {
  const router = useRouter();

  const uuid: string | undefined = router.query.uuid as string | undefined;

  const [editing, setEditing] = useState<boolean>(false);

  const [name, setName] = useState<string>('New');

  return (
    <CPanelPage>
      <Box>
        <Typography variant="h3">Schema:&nbsp;</Typography>
        {editing ? (
          <TextField defaultValue={name} />
        ) : (
          <Typography variant="h3" color="primary">
            {name}
          </Typography>
        )}
      </Box>
      <Fab
        onClick={() => {
          setEditing(!editing);
        }}
      >
        {!editing ? <EditIcon /> : <SaveIcon />}
      </Fab>
    </CPanelPage>
  );
}
