import { PrismaClient } from "@prisma/client";
import { Goal } from "lucide-react";
declare global{
    var cachePrisma:PrismaClient;
}
let prisma:PrismaClient;
if(process.env.NODE_ENV==='production')
{
    prisma=new PrismaClient();

}
else{
    if(!global.cachePrisma)
    {
        global.cachePrisma=new PrismaClient();
    }
    prisma=global.cachePrisma;
}
export default prisma;