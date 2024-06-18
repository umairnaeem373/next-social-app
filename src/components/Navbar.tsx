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
import { ModeToggle } from "./Toggle";

const Navbar = () => {

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="flex items-center py-4 gap-10 justify-between">
        <Image src="/next.svg" alt="logo" width={40} height={40} />
        <Input type="text" placeholder="Search" className="w-3/4" />
        <ModeToggle/>
      </div>
    </div>
  );
};

export default Navbar;
