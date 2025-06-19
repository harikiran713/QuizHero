"use client"
import CustomWordCloud from "@/components/CustomWordCloud";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HotTopics()
{
    return(

        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="font-bold text-2xl">Hot topics</CardTitle>
                <CardDescription>Click on a topic to start quiz on it</CardDescription>
            </CardHeader>
            <CardContent>
                <CustomWordCloud/>
            </CardContent>
        </Card>
    );
}