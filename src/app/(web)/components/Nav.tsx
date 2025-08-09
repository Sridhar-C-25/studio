
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X, LogOut, User as UserIcon, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/auth-context";
import { ThemeToggleButton } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  const renderAuthSection = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      );
    }
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarImage src={`https://cloud.appwrite.io/v1/avatars/initials?name=${user.name}&width=36&height=36`} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
             <DropdownMenuItem onClick={() => router.push('/dashboard')}>
              <LayoutGrid className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
       <Link href="/sign-in">
        <Button variant="outline">Sign In</Button>
      </Link>
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${
        isScrolled ? "bg-background/80 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold hover:text-foreground transition-colors"
        >
        <Image
            src="/logo.png"
            alt="Code A Program"
            width={40}
            height={40}
            className="rounded-full border"
          />
          <span className="hidden sm:inline-block">Code A Program</span>
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
           <Link
            href="/youtube"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Video
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact Us
          </Link>
        </nav>
        <div className="hidden md:flex gap-4 items-center">
          <ThemeToggleButton />
          {renderAuthSection()}
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggleButton />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-lg border-b">
          <div className="container py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/youtube"
              className="py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Videos
            </Link>
            <Link
              href="/about"
              className="py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
            <div className="pt-4 border-t">
              {loading ? (
                 <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              ) : user ? (
                 <div className="flex flex-col gap-2">
                   <Link href="/dashboard">
                    <Button variant="outline" className="w-full justify-start">Dashboard</Button>
                   </Link>
                   <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>Log Out</Button>
                </div>
              ) : (
                <Link href="/sign-in" className="w-full">
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
