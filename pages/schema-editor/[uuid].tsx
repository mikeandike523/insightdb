import { useState } from 'react';

import { useRouter } from 'next/router';

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Fab,
  Stack,
  TextField,
  Typography
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';

import CheckIcon from '@mui/icons-material/Check';

import AddIcon from '@mui/icons-material/Add';

import CPanelPage from '@/components/CPanelPage';

import {
  DragHandle,
  dragHandleClassName,
  ReorderableList
} from '@/components/ReorderableList';

import theme from '@/themes/default';

import { Field, ValueType } from '@/utils/CYFORM';

import { iota } from '@/utils/tsutils';

function Entry({
  field,
  editing,
  index
}: {
  index: number;
  field: Field;
  editing: boolean;
}) {
  return (
    <Box
      className={dragHandleClassName}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        margin: theme.spacing.sm,
        gap: theme.spacing.sm
      }}
    >
      {editing && <DragHandle />}
      <span>
        <b>Field #{index + 1}</b>
      </span>
      <span>
        <b>name:</b>&nbsp;
        {editing ? <TextField defaultValue={field.name} /> : field.name}
      </span>
      <span>
        <b>required:</b>&nbsp;
        <Checkbox defaultChecked={field.required} disabled={!editing} />
      </span>
      <span>
        <b>nullable:</b>&nbsp;
        <Checkbox defaultChecked={field.nullable} disabled={!editing} />
      </span>
    </Box>
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

  const [order, setOrder] = useState<number[]>(iota(fields.length));

  return (
    <CPanelPage>
      <Stack direction="row" alignItems="center">
        <Typography variant="h3" component="h1">
          Schemas/
        </Typography>
        {editing ? (
          <TextField defaultValue={name} />
        ) : (
          <Typography variant="h3" color="primary">
            {name}
          </Typography>
        )}
      </Stack>

      <Divider
        sx={{
          mt: theme.spacing.sm,
          mb: theme.spacing.sm
        }}
      />

      <Typography variant="h4" component="h2">
        Fields
      </Typography>

      {fields.length > 0 ? (
        <ReorderableList
          enabled={editing}
          order={order}
          setOrder={setOrder}
          items={fields.map((field, idx) => {
            return (
              <Entry
                key={idx}
                index={order[idx]}
                field={field}
                editing={editing}
              />
            );
          })}
        />
      ) : (
        <Typography variant="body1" component="p">
          <i>No fields</i>
        </Typography>
      )}

      <Button startIcon={<AddIcon />}>New Field</Button>

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
        {saving ? (
          <CircularProgress />
        ) : !editing ? (
          <EditIcon />
        ) : (
          <CheckIcon />
        )}
      </Fab>
    </CPanelPage>
  );
}
