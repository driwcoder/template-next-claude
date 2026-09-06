import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/** Current session on the server, or `null`. Use in RSC / route handlers. */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}
