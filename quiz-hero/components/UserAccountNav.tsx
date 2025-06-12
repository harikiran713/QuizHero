"use client"
import { DropdownMenu, DropdownMenuContent,DropdownMenuSeparator, DropdownMenuItem,DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { LogOut } from 'lucide-react';
import UserAvatar from "./UserAvatar";

export default function UserAccount({user}:any){
    return(
<DropdownMenu>
    <DropdownMenuTrigger asChild>
        {/* avatar */}
    <p><UserAvatar user={user}/></p>   
    </DropdownMenuTrigger>
    <DropdownMenuContent className="bg-white" >
        {user.name &&  <DropdownMenuItem>{user.name}</DropdownMenuItem>}
        {user.email && <DropdownMenuItem>{user.email}</DropdownMenuItem>}
 <DropdownMenuSeparator />
 <DropdownMenuItem onClick={()=>{signOut()}} className="flex flex-row  cursor-pointer text-red-600"><div className="flex flex-row items-center mx-auto"><span className="px-2">signOut</span><LogOut /> </div></DropdownMenuItem>
    </DropdownMenuContent>

</DropdownMenu>
    );
}