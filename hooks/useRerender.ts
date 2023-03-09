import { useState } from 'react';

export default function useRerender(): () => void {
  const [renderCount, setRenderCount] = useState<number>(0);
  return () => setRenderCount(renderCount + 1);
}
