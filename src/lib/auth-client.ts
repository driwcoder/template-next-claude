"use client";

import { createAuthClient } from "better-auth/react";

// No baseURL: the client talks to its own origin (`window.location.origin`),
// so it works on any host/port without a rebuild. Set one only for a separate
// auth backend.
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
