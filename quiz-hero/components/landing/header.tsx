import { Button } from "../ui/button";
import Title from "./title";

export default function Header()
{
    return(
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 h-16 ">
            <div className="container   h-full flex items-center justify-between px-8 ">
                <Title/>
            </div>

        </header>
    );
}