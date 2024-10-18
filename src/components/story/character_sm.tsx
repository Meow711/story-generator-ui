import { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface CharacterProfileSMProps {
    name: string
    avatar?: string
    onDelete: () => void
}

export default function CharacterProfileSM({ name, avatar, onDelete }: CharacterProfileSMProps) {
    const [isHovered, setIsHovered] = useState(false)

    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()

    return (
        <div
            className="flex items-center p-2 bg-background rounded-lg shadow relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Avatar className="h-12 w-12 mr-3">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
                <p className="text-sm font-medium text-foreground">{name}</p>
            </div>
            {isHovered && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 text-muted-foreground hover:text-destructive"
                    onClick={onDelete}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                </Button>
            )}
        </div>
    )
}