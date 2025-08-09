
"use server";

import { cookies } from "next/headers";
import { getAdminClient, getSessionClient } from "./appwrite";
import { ID, Client, Account } from "node-appwrite";
import type { Models } from "node-appwrite";

export async function login(email: string, password: string) {
  try {
    const { account } = await getAdminClient();
    const user = await account.get();
     if (!user.emailVerification) {
      return { success: false, error: "Please verify your email before logging in." };
    }
    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("appwrite-session", session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(session.expire),
    });

    return { success: true };
  } catch (e: any) {
    console.error(e);
     if (e.message.includes("Invalid credentials")) {
      return { success: false, error: "Invalid email or password." };
    }
    if (e.message.includes("User not found")) {
      return { success: false, error: "Invalid email or password." };
    }
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function resendVerificationEmail(email: string) {
  try {
    const { users } = await getAdminClient();
    const user = await users.list(
      [
        Query.equal("email", email)
      ]
    )

    if (user.users.length === 0) {
      return { success: false, error: "User not found." };
    }

    const userId = user.users[0].$id;

    // Create a new client with the user's session to send the verification email
    const userClient = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT_ID!);
    const userAccount = new Account(userClient);
    
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email`;
    await userAccount.createVerification(url);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to resend verification email", error);
    return { success: false, error: (error as Error).message };
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
    await users.create(ID.unique(), email, null, password, name);

    // Create a session for the new user to send the verification email
    const session = await adminAccount.createEmailPasswordSession(
      email,
      password
    );

    // Create a new client with the user's session to send the verification email
    const userClient = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT_ID!)
      .setSession(session.secret);

    const userAccount = new Account(userClient);
    
    // Send verification email using the new user's session
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email`;
    await userAccount.createVerification(url);

    return { success: true };
  } catch (error) {
    console.error("Failed to sign up", error);
    return { success: false, error: (error as Error).message };
  }
}


export async function updateEmailVerificationStatus(
  userId: string,
  secret: string
) {
  try {
    // Create a new client with the user's session to send the verification email
    const userClient = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT_ID!);
    const userAccount = new Account(userClient);
    await userAccount.updateVerification(userId, secret);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}
