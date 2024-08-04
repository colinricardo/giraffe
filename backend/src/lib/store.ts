import { IdPrefix, randomId } from "@/utils/ids";
import { AsyncLocalStorage } from "async_hooks";

type StoreData = {
  [key: string]: any;
};

export const store = new AsyncLocalStorage<StoreData>();

export const setToStore = (key: string, obj: object) => {
  const storeData = store.getStore() || {};
  storeData[key] = { ...(storeData[key] || {}), ...obj };
  store.enterWith(storeData);
};

export const getFromStore = (key: string) => {
  const storeData = store.getStore() || {};
  return storeData[key] || {};
};

export const generateCorrelationId = (headers: Headers) => {
  return (
    headers.get("x-correlation-id") ||
    randomId({ prefix: IdPrefix.Correlation })
  );
};

export const runWithStore = <T>(callback: () => T): T => {
  return store.run({}, callback);
};

export const initializeStore = (
  correlationId: string,
  userId?: string | null
) => {
  setToStore("context", { correlationId, userId });
};
