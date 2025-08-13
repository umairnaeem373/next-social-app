'use client'
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import { ModeToggle, UserToggle } from "./Toggle";
import { Search, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
      <div className="flex items-center py-4 justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image 
            priority 
            src="/next.svg" 
            alt="logo" 
            className="h-auto w-20 sm:w-24 md:w-28" 
            width={100} 
            height={40} 
          />
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <Input 
            type="text" 
            placeholder="Search..." 
            className="w-full" 
          />
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <UserToggle />
          <ModeToggle />
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden pb-4 px-2">
          <Input 
            type="text" 
            placeholder="Search..." 
            className="w-full" 
            autoFocus
          />
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
          <div className="flex flex-col gap-4 px-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Theme</span>
              <ModeToggle />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Account</span>
              <UserToggle />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;