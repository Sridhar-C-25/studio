import type { PropsWithChildren } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/icons";
import { BookText, LayoutGrid } from "lucide-react";
import Link from "next/link";
import AdminProfile from "./_components/AdminProfile";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="size-7 text-primary" />
            <span className="font-headline text-lg font-semibold group-data-[collapsible=icon]:hidden">
              Apex Editor
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard/overview" className="w-full">
                <SidebarMenuButton tooltip="Overview">
                  <LayoutGrid />
                  Overview
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/blogs" className="w-full">
                <SidebarMenuButton tooltip="Blogs">
                  <BookText />
                  Blogs
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/categories" className="w-full">
                <SidebarMenuButton tooltip="Categories">
                  <LayoutGrid />
                  Categories
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:px-6">
          <SidebarTrigger className="lg:hidden" />
          <div className="ml-auto">
            <AdminProfile />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
