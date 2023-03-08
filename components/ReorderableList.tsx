import { ReactNode, useState } from 'react';

import DragHandleIcon from '@mui/icons-material/DragHandle';

import { Container, Draggable, OnDropCallback } from 'react-smooth-dnd';

import { iota } from '@/utils/tsutils';

export function DragHandle() {
  return (
    <span className="drag-handle">
      <DragHandleIcon />
    </span>
  );
}

export default function ReorderableList({ items }: { items: ReactNode[] }) {
  const [order, setOrder] = useState<number[]>(iota(items.length));

  // Create a shallow reordered copy of the items array
  const reorderedItems: ReactNode[] = [];
  for (const i of order) {
    reorderedItems.push(items[i]);
  }

  const onDrop: OnDropCallback = ({ removedIndex, addedIndex }) => {
    const newOrder = JSON.parse(JSON.stringify(order));
    newOrder.splice(removedIndex, 1);
    newOrder.splice(addedIndex, 0, removedIndex);
    setOrder(newOrder);
  };

  return (
    <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
      {reorderedItems.map((item, index) => {
        return <Draggable key={index}>{item}</Draggable>;
      })}
    </Container>
  );
}

export { ReorderableList };
