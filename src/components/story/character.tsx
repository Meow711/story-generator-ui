"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import { MessageCircle } from "lucide-react";
import { IUser } from "../chat/context";


interface CharacterProfileProps {
    name: string
    bio: string
    avatar?: string
    onChatClick?: (user: IUser) => void;
    hiddenChat?: boolean;
}

const CharacterProfile = ({ name, bio, avatar, onChatClick, hiddenChat }: CharacterProfileProps) => {
    return (
        <Card className="w-full overflow-hidden flex flex-col">
            <div className="relative w-full pt-[100%]">
                {avatar && <Image
                    src={avatar}
                    alt={name}
                    layout="fill"
                    objectFit="cover"
                    className="absolute top-0 left-0"
                />}
                {!hiddenChat && <Button onClick={() => onChatClick && onChatClick({ name, description: bio, avatar })} className="absolute top-2 right-2">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat
                </Button>}
            </div>
            <CardContent className="p-3 bg-background">
                <h3 className="text-lg font-semibold text-foreground truncate">{name}</h3>
                <p className="text-sm text-muted-foreground">{bio}</p>
            </CardContent>
        </Card>
    )
}
export default CharacterProfile;