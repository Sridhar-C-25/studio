
"use server";

import { cookies } from "next/headers";
import { getAdminClient, getSessionClient } from "./appwrite";
import { ID } from "node-appwrite";
import type { Models } from "node-appwrite";

export async function login(email: string, password: string) {
  try {
    const { account } = await getAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

   (await cookies()).set("appwrite-session", session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "strict",
      path: "/",
      expires: new Date(session.expire),
    });

    return { success: true };
  } catch(e) {
    console.error(e);
    return { success: false }
  }
}

export async function logout() {
  try {
    const { account } = await getSessionClient();
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    console.error("Failed to logout", error);
  }
}

export async function getCurrentUser(): Promise<Models.User<Models.Preferences> | null> {
  try {
    const { account } = await getSessionClient();
    return await account.get();
  } catch {
    return null;
  }
}

export async function signUp(email: string, password: string, name: string) {
  try {
    const { account , users} = await getAdminClient();
    const user = await users.create(ID.unique(), email, null, password, name);
    
    // Send verification email
    const session = await account.createEmailPasswordSession(email, password);
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email`;
    await account.createVerification(url);
    (await cookies()).set("appwrite-session", session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "strict",
      path: "/",
      expires: new Date(session.expire),
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to sign up", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateEmailVerificationStatus(userId: string, secret: string) {
    try {
        const { account } = await getAdminClient();
        await account.updateVerification(userId, secret);
        return { success: true }
    } catch(e) {
        console.error(e)
        return { success: false }
    }
}
