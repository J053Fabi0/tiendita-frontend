import sleep from "../utils/sleep";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useAuthTokenReady } from "../context/personContext";

const notDefaultValue = {};

interface Params<message> {
  /**
   * The time it waits until retrying, in case of failure.
   * @default 1000
   */
  retryTime?: number;

  /**
   * The default value it will get every time the conditions are not met.
   */
  defaultValue?: SetStateAction<message>;

  /**
   * This callback will be called before and after the loaing of the httpMethod.
   */
  loadingCB?: (loading: boolean) => void;

  /**
   * If this is false or returns false, it won't start loading.
   */
  conditionToStart?: boolean | (() => boolean);
}

/**
 * Reduce the code necessary to interact with the backend.
 * @param deps The dependecies for the useEffect.
 * @param setter The setter of the data gathered.
 * @param httpMethod A function that returns the httpMethod you want to call.
 */
export default function useLoadData<message>(
  deps: any[],
  setter: Dispatch<SetStateAction<message>>,
  httpMethod: () => Promise<{ data: { message: message } }>,
  {
    retryTime = 1000,
    conditionToStart = true,
    loadingCB = () => void 0,
    defaultValue = notDefaultValue as any,
  }: Params<message> = {}
) {
  const authTokenReady = useAuthTokenReady();

  useEffect(() => {
    (async () => {
      if (!authTokenReady || !(typeof conditionToStart === "boolean" ? conditionToStart : conditionToStart())) {
        if (defaultValue !== notDefaultValue) setter(defaultValue);
        return;
      }

      loadingCB(true);
      let message: null | message = null;
      while (message === null)
        try {
          message = (await httpMethod()).data.message;
        } catch (e) {
          console.error(e);
          await sleep(retryTime);
        }

      loadingCB(false);
      setter(message);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
