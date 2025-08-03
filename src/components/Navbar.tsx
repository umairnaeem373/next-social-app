import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { ModeToggle, UserToggle } from "./Toggle";

const Navbar = () => {

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="flex items-center py-4 gap-10 justify-between">
        <Image priority src="/next.svg" alt="logo" className="h-auto" width={100} height={40} />
        <Input type="text" placeholder="Search..." className="w-3/4" />
        <UserToggle/>
        <ModeToggle/>
      </div>
    </div>
  );
};

export default Navbar;
