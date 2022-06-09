import { useEffect } from "react";
import useTimeout from "./useTimeout";

/**
 * This will run the callback only after the dependencies stop changing for a custom delay.
 * The callback will not be run on the first run or render.
 * @param callback It will run after the dependencies change and the delay is met.
 * @param delay The delay.
 * @param dependencies The dependencies that will make the callback run when they change.
 */
export default function useDebounce(callback: Function, delay: number, dependencies: Array<any>) {
  // Create a timeout with the callback and delay.
  const { reset, clear } = useTimeout(callback, delay);
  // Run reset every time a dependencie changes.
  useEffect(reset, [...dependencies, reset]);
  // Run clear when the hook is initialized, to prevent calling the callback at the first run.
  useEffect(clear, [clear]);
}
