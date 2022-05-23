import { useCallback, useState } from "react";

export default function useMayLoad() {
  const [mayLoad, setMayLoad] = useState(false);

  const allowLoading = useCallback(() => {
    if (!mayLoad) setMayLoad(true);
    // eslint-disable-next-line
  }, [setMayLoad]);

  return [mayLoad, allowLoading] as const;
}
