"use client"

import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { FilePlus2, SunIcon, MoonIcon, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes"
import { useState } from "react";
import UpgradeButton from "./UpgradeButton";

function Header() {
  const { setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Bubble <span className="text-purple-600 dark:text-indigo-400">Docs</span>
            </span>
          </Link>

          <SignedIn>
            <div className="hidden md:flex items-center space-x-4">
              <Button asChild variant="default" className="bg-indigo-600 text-white hover:bg-indigo-700">
                <Link href="/dashboard/upgrade">Pricing</Link>
              </Button>

              <Button asChild variant="ghost">
                <Link href="/dashboard">My Documents</Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="w-9 h-9">
                    <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button asChild variant="outline" className="border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900">
                <Link href="/dashboard/upload">
                  <FilePlus2 className="text-indigo-600 dark:text-indigo-400" />
                </Link>
              </Button>

              <UpgradeButton />
              <UserButton afterSignOutUrl="/" />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </SignedIn>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Button asChild variant="default" className="w-full justify-start bg-indigo-600 text-white hover:bg-indigo-700">
              <Link href="/dashboard/upgrade">Pricing</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/dashboard">My Documents</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/dashboard/upload">Upload Document</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;