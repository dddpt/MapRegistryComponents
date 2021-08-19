import { areArraysEqual, nullIfEmpty } from "../utils";

export const isDiffPagination = (pagination1, pagination2) =>
  (pagination1 || pagination2) && // If both null, same queries
  ((!pagination1 && pagination1 !== pagination2) || // If only one null
    (!pagination2 && pagination1 !== pagination2) ||
    pagination1.limit !== pagination2.limit ||
    pagination1.offset !== pagination2.offset);
