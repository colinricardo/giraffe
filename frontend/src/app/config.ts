export const isProduction =
  process.env.NODE_ENV === "production" ? true : false;

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql";

const _getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const BASE_URL = _getBaseUrl();

export const MODAL_SIZE_MEDIUM = "w-[50vw] h-[50vh]";
export const MODAL_SIZE_SMALL = "w-[50vw] h-[25wh]";
