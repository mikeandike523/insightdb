import { Dispatch, ReactNode, SetStateAction } from 'react';

import DragHandleIcon from '@mui/icons-material/DragHandle';

import { Container, Draggable, OnDropCallback } from 'react-smooth-dnd';

import { arrayMoveImmutable } from 'array-move';

import theme from '@/themes/default';

import useRerender from '@/hooks/useRerender';

export function DragHandle() {
  return (
    <span className="drag-handle">
      <DragHandleIcon />
    </span>
  );
}

export const dragHandleClassName = 'drag-handle';

export default function HorizontalReorderableList({
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
  const rerender = useRerender();

  const onDrop: OnDropCallback = ({ removedIndex, addedIndex }) => {
    const newOrder = arrayMoveImmutable(
      order,
      removedIndex ?? 0,
      addedIndex ?? 0
    );
    console.log(order, newOrder);
    setOrder(newOrder);
    rerender();
  };

  return enabled ? (
    // Ignore due to an error in the react-smooth-dnd library
    // See: https://github.com/kutlugsahin/react-smooth-dnd/issues/88
    // @ts-ignore
    <Container
      dragHandleSelector=".drag-handle"
      lockAxis="x"
      onDrop={onDrop}
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'left',
        gap: theme.spacing.md
      }}
      orientation="horizontal"
    >
      {items.map((item, index) => {
        // Ignore due to an error in the react-smooth-dnd library
        // See: https://github.com/kutlugsahin/react-smooth-dnd/issues/88
        // @ts-ignore
        return (
          // Ignore due to an error in the react-smooth-dnd library
          // See: https://github.com/kutlugsahin/react-smooth-dnd/issues/88
          // @ts-ignore
          <Draggable style={{}} key={index}>
            {item}
          </Draggable>
        );
      })}
    </Container>
  ) : (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'top',
        gap: theme.spacing.md
      }}
    >
      {items.map((item, index) => {
        // Ignore due to an error in the react-smooth-dnd library
        // See: https://github.com/kutlugsahin/react-smooth-dnd/issues/88
        // @ts-ignore
        return <div key={index}>{item}</div>;
      })}
    </div>
  );
}

export { HorizontalReorderableList };
