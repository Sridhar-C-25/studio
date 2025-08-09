"use server";

import { cookies } from "next/headers";
import { getAdminClient, getSessionClient } from "./appwrite";

// Login
export async function login(email: string, password: string) {
  const { account } = await getAdminClient();
  const session = await account.createEmailPasswordSession(email, password);

  (await cookies()).set("appwrite-session", session?.secret, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  return { success: true };
}

// Logout
export async function logout() {
  try {
    const { account } = await getSessionClient();
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
    return { success: true };
  } catch {
    return { success: false };
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const { account } = await getSessionClient();
    return await account.get();
  } catch {
    return null;
  }
}

// Check if user is in a role (team)
export async function userHasRole(roleName: string) {
  try {
    const { teams } = await getSessionClient();
    const memberships = await teams.list();
    return memberships.teams.some(
      (team) => team.name.toLowerCase() === roleName.toLowerCase()
    );
  } catch {
    return false;
  }
}
