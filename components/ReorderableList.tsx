import { Dispatch, ReactNode, SetStateAction } from 'react';

import DragHandleIcon from '@mui/icons-material/DragHandle';

import { Container, Draggable, OnDropCallback } from 'react-smooth-dnd';

import { arrayMoveImmutable } from 'array-move';

export function DragHandle() {
  return (
    <span className="drag-handle">
      <DragHandleIcon />
    </span>
  );
}

export const dragHandleClassName = 'drag-handle';

export default function ReorderableList({
  items,
  enabled = true,
  order,
  setOrder
}: {
  items: ReactNode[];
  enabled?: boolean;
  order: number[];
  setOrder: Dispatch<SetStateAction<number[]>>;
}) {
  // Create a shallow reordered copy of the items array
  const reorderedItems: ReactNode[] = [];
  for (const i of order) {
    reorderedItems.push(items[i]);
  }

  const onDrop: OnDropCallback = ({ removedIndex, addedIndex }) => {
    const newOrder = arrayMoveImmutable(
      order,
      removedIndex ?? 0,
      addedIndex ?? 0
    );
    setOrder(newOrder);
  };

  return enabled ? (
    // Ignore due to an error in the react-smooth-dnd library
    // See: https://github.com/kutlugsahin/react-smooth-dnd/issues/88
    // @ts-ignore
    <Container
      dragHandleSelector=".drag-handle"
      lockAxis="y"
      onDrop={onDrop}
      style={{ width: '100%' }}
    >
      {reorderedItems.map((item, index) => {
        // Ignore due to an error in the react-smooth-dnd library
        // See: https://github.com/kutlugsahin/react-smooth-dnd/issues/88
        // @ts-ignore
        return <Draggable key={index}>{item}</Draggable>;
      })}
    </Container>
  ) : (
    <div style={{ width: '100%' }}>
      {reorderedItems.map((item, index) => {
        // Ignore due to an error in the react-smooth-dnd library
        // See: https://github.com/kutlugsahin/react-smooth-dnd/issues/88
        // @ts-ignore
        return <div key={index}>{item}</div>;
      })}
    </div>
  );
}

export { ReorderableList };
