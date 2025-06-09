import { Card,CardContent,CardHeader,CardFooter,CardTitle,CardAction,CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";


export default function Signin()
{
    return(
<div>
    <Card className=" w-full max-w-sm">
        <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>Enter you email below to login to your account</CardDescription>
            <CardAction><Button variant='link' className="cursor-pointer">Sign Up</Button></CardAction>
        </CardHeader>
        <CardContent>
            <form action="">
                <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input/>
                    <Label>Password</Label>
                    <Input/>

                </div>
            </form>
        </CardContent>
        <CardFooter>
            <div className="flex flex-col gap-2 w-full">
                <Button className="cursor-pointer">Login</Button>
                <Button variant="outline" className="cursor-pointer">Login with Google</Button>

            </div>
        </CardFooter>
    </Card>
</div>
    );
}