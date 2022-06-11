import { useCallback, useState } from "react";

export default function useMayLoad() {
  const [mayLoad, setMayLoad] = useState(false);

  const allowLoading = useCallback(() => {
    if (!mayLoad) setMayLoad(true);
  }, [setMayLoad, mayLoad]);

  const disallowLoading = useCallback(() => {
    if (mayLoad) setMayLoad(false);
  }, [setMayLoad, mayLoad]);

  return [mayLoad, allowLoading, disallowLoading] as const;
}
