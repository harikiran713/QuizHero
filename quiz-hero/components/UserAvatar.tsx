import { Avatar,AvatarImage } from "@/components/ui/avatar";
import { CircleUserRound } from 'lucide-react';


export default function UserAvatar({user}:any){
    return(
<Avatar>
{user.image?<AvatarImage src={user.image}/>:   <CircleUserRound  className="size-8 cursor-pointer"/>}
</Avatar>
    );
}