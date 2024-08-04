import { builder } from "./builder";

import "@/mutations/user";
import "@/queries/user";

export const schema = builder.toSchema();
