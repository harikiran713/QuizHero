import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export default function RecentCard()
{
    return(
<Card className="col-span-4 lg:col-span-3">
    <CardHeader>
        <CardTitle className="font-bold text-2xl">
            Recent Activity
        </CardTitle>
        <CardDescription>
            you have played 12 games

        </CardDescription>
    </CardHeader>
    <CardContent className="max-h-[580px]">
hisotries
    </CardContent>

</Card>
    );
}