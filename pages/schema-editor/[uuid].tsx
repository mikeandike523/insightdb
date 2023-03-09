import { Dispatch, SetStateAction, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Fab,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';

import CheckIcon from '@mui/icons-material/Check';

import SaveIcon from '@mui/icons-material/Save';

import CancelIcon from '@mui/icons-material/Cancel';

import AddIcon from '@mui/icons-material/Add';

import CPanelPage from '@/components/CPanelPage';

import {
  DragHandle,
  dragHandleClassName,
  HorizontalReorderableList
} from '@/components/HorizontalReorderableList';

import theme from '@/themes/default';

import {
  Field,
  stringToValueType,
  ValueType,
  ValueTypeToString
} from '@/utils/CYFORM';

import { iota } from '@/utils/tsutils';

import useRerender from '@/hooks/useRerender';

function Entry({
  editing,
  index,
  fields,
  setFields,
  _key
}: {
  index: number;
  editing: boolean;
  fields: Array<Field>;
  setFields: Dispatch<SetStateAction<Array<Field>>>;
  _key: number;
}) {
  console.log('Entry', _key, index);

  const field = fields[index];

  const rerender = useRerender();

  return (
    <Paper
      elevation={theme.paper.elevation}
      sx={{ width: theme.card.width.md }}
    >
      <Box
        className={dragHandleClassName}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'left',
          margin: theme.spacing.sm,
          gap: theme.spacing.sm
        }}
      >
        {editing && <DragHandle />}
        <span>
          <b>name:</b>&nbsp;
          {editing ? (
            <TextField
              onChange={(e) => {
                fields[index].name = e.target.value;
                setFields(fields);
                rerender();
              }}
              value={field.name}
            />
          ) : (
            field.name
          )}
        </span>
        <span>
          <b>type:</b>&nbsp;
          {editing ? (
            <Select
              value={ValueTypeToString(field.type)}
              onChange={(e) => {
                console.log(e.target.value);
                fields[index].type = stringToValueType(e.target.value);
                setFields(fields);
                rerender();
              }}
            >
              <MenuItem value="string">string</MenuItem>
              <MenuItem value="number">number</MenuItem>
              <MenuItem value="boolean">boolean</MenuItem>
              <MenuItem value="date">date</MenuItem>
            </Select>
          ) : (
            field.type
          )}
        </span>
        <span>
          <b>required:</b>&nbsp;
          <Checkbox
            checked={field.required}
            disabled={!editing}
            onChange={(evt) => {
              fields[index].required = evt.target.checked;
              setFields(fields);
              rerender();
            }}
          />
        </span>
        <span>
          <b>nullable:</b>&nbsp;
          <Checkbox
            checked={field.nullable}
            disabled={!editing}
            onChange={(evt) => {
              fields[index].nullable = evt.target.checked;
              setFields(fields);
              rerender();
            }}
          />
        </span>
        {!field.required && !field.nullable && (
          <Alert severity="error">Optional fields must be nullable.</Alert>
        )}
      </Box>
    </Paper>
  );
}

export default function SchemaEditor() {
  const router = useRouter();

  const uuid: string | undefined = router.query.uuid as string | undefined;

  const [editing, setEditing] = useState<boolean>(false);

  const [saving, setSaving] = useState<boolean>(false);

  const [name, setName] = useState<string>('New');

  const [fields, setFields] = useState<Field[]>([]);

  const [order, setOrder] = useState<number[]>(iota(fields.length));

  const rerender = useRerender();

  console.log(fields);

  const oldFields = useRef<Field[]>(JSON.parse(JSON.stringify(fields)));

  const oldName = useRef<string>(name);

  console.log('order', order);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate saving for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (e: unknown) {
    } finally {
      setSaving(false);
    }
  };

  return (
    <CPanelPage>
      <Stack direction="row" alignItems="center">
        <Typography variant="h3" component="h1">
          Schemas/
        </Typography>
        {editing ? (
          <TextField
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
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
        <HorizontalReorderableList
          enabled={editing}
          order={order}
          setOrder={setOrder}
          items={fields.map((_, idx) => {
            return (
              <Entry
                key={idx}
                _key={idx}
                index={order[idx]}
                fields={fields}
                setFields={setFields}
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
      <Button
        startIcon={<AddIcon />}
        onClick={() => {
          order.push(order.length);
          fields.push({
            name: 'untitled',
            type: ValueType.STRING,
            required: true,
            nullable: true
          });
          oldFields.current.push({
            name: 'untitled',
            type: ValueType.STRING,
            required: true,
            nullable: true
          });
          setFields(fields);
          setOrder(order);
          rerender();
        }}
      >
        New Field
      </Button>
      <Box
        sx={{
          position: 'absolute',
          bottom: '0',
          right: 0,
          margin: theme.spacing.lg,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.sm
        }}
      >
        {saving ? (
          !editing ? (
            <>
              <Fab
                onClick={() => {
                  oldFields.current = JSON.parse(JSON.stringify(fields));
                  oldName.current = name;
                  setEditing(true);
                }}
              >
                <EditIcon />
              </Fab>
              <Fab>
                <SaveIcon />
              </Fab>
            </>
          ) : (
            <>
              <Fab
                onClick={() => {
                  setEditing(false);
                }}
              >
                <CheckIcon />
              </Fab>
              <Fab
                onClick={() => {
                  setFields(oldFields.current);
                  setName(oldName.current);
                  setEditing(false);
                }}
              >
                <CancelIcon />
              </Fab>
            </>
          )
        ) : (
          <CircularProgress />
        )}
      </Box>
    </CPanelPage>
  );
}
