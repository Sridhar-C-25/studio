'use server';

import { Client, Account, Databases, Storage, Teams } from 'node-appwrite';
import { cookies } from 'next/headers';

// Admin client (server-only, API key)
export async function getAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

  return {
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
    teams: new Teams(client),
  };
}

// Session client (server-only, from cookies)
export async function getSessionClient() {
  const session = (await cookies()).get("appwrite-session")?.value;
  if (!session) throw new Error("No session cookie");

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setSession(session);

  return {
    account: new Account(client),
    teams: new Teams(client),
    databases: new Databases(client),
    storage: new Storage(client),
  };
}
