import { useState } from 'react';

import { useRouter } from 'next/router';

import {
  CircularProgress,
  Fab,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';

import SaveIcon from '@mui/icons-material/Save';

import CPanelPage from '@/components/CPanelPage';

import { DragHandle, ReorderableList } from '@/components/ReorderableList';

import LeftAndRightItemsBar from '@/components/LeftAndRightItemsBar';

import theme from '@/themes/default';

import { Field, ValueType } from '@/utils/CYFORM';

function Entry({ name }: { name: string }) {
  return (
    <Paper elevation={theme.paper.elevation}>
      <LeftAndRightItemsBar
        leftContent={[
          <Typography key={0} variant="body1">
            {name}
          </Typography>
        ]}
        rightContent={[<DragHandle key={0} />]}
      />
    </Paper>
  );
}

export default function SchemaEditor() {
  const router = useRouter();

  const uuid: string | undefined = router.query.uuid as string | undefined;

  const [editing, setEditing] = useState<boolean>(false);

  const [saving, setSaving] = useState<boolean>(false);

  const [name, setName] = useState<string>('New');

  const [fields, setFields] = useState<Field[]>([
    {
      name: 'testField',
      type: ValueType.STRING,
      required: true,
      nullable: false
    },
    {
      name: 'testField2',
      type: ValueType.DATE,
      required: false,
      nullable: true
    }
  ]);

  return (
    <CPanelPage>
      <Stack direction="row" alignItems="center">
        <Typography variant="h3">Schemas/</Typography>
        {editing ? (
          <TextField defaultValue={name} />
        ) : (
          <Typography variant="h3" color="primary">
            {name}
          </Typography>
        )}
      </Stack>
      <ReorderableList
        items={fields.map((field, idx) => {
          return <Entry key={idx} name={field.name} />;
        })}
      />
      <Fab
        onClick={() => {
          setEditing(!editing);
        }}
        sx={{
          position: 'absolute',
          bottom: '0',
          right: 0,
          margin: theme.spacing.lg
        }}
      >
        {saving ? <CircularProgress /> : !editing ? <EditIcon /> : <SaveIcon />}
      </Fab>
    </CPanelPage>
  );
}
