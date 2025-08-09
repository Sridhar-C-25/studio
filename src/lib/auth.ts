
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
    const { account: adminAccount, users } = await getAdminClient();
    
    // Create the user with admin privileges
    const user = await users.create(ID.unique(), email, null, password, name);
    
    // Create a session for the new user to send the verification email
    const session = await adminAccount.createEmailPasswordSession(email, password);

    const client = await getSessionClient();
    
    // Send verification email using the new user's session
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email`;
    await client.account.createVerification(url);

    // Now, log the user out so they have to verify first, but keep their session cookie
    // so the browser knows who they are. The middleware will handle access control.
    // Or, we can just set the cookie and let them proceed to a "please verify" state.
    
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
