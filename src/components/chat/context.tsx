'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface IUser {
    name: string;
    description: string;
    avatar?: string;
}
export interface IContactUser extends IUser {
    // id: number;
    lastMessage?: string
}

export interface IMessage {
    id: number;
    // senderId: number;
    sender: string;
    receiver: string;
    text: string
    timestamp: string
}


interface ChatContextType {
    // dialog
    isOpen: boolean
    openChat: (user?: IContactUser) => void
    closeChat: () => void
    // data
    users: IContactUser[];
    setUsers: (users: IContactUser[]) => void
    messages: IMessage[];
    appendMessage: (msg: IMessage) => void;
    currentUser?: IContactUser;
    setCurrentUser: (user: IContactUser) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [users, setUsers] = useState<IContactUser[]>([])
    const [currentUser, setCurrentUser] = useState<IContactUser>()
    const [messages, setMessages] = useState<IMessage[]>([]);

    const openChat = (user?: IContactUser) => {
        setIsOpen(true)
        if (user) {
            setCurrentUser(user)
        }
    }
    const closeChat = () => setIsOpen(false)

    const appendMessage = (msg: IMessage) => {
        console.log("====>", msg)
        setMessages(prev => [...prev, msg]);
    }

    return (
        <ChatContext.Provider value={{ isOpen, openChat, closeChat, users, messages, setUsers, currentUser, setCurrentUser, appendMessage }}>
            {children}
        </ChatContext.Provider>
    )
}

export function useChatContext() {
    const context = useContext(ChatContext)
    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatProvider')
    }
    return context
}