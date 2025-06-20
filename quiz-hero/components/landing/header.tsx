import { Button } from "../ui/button";
import Title from "./title";
import Navigation from "./navigation";
import Header2 from "./header2";

export default function Header()
{
    return(
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 h-16 ">
            <div className="container   h-full flex items-center justify-between px-8 ">
                <Title/>
                <Navigation/>
                <Header2/>
               
            </div>
            

        </header>
    );
}