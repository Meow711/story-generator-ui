'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Send } from 'lucide-react'
import { useChatContext, IMessage } from './context'

const ME = 'me';

const ChatComponent = () => {
    const [newMessage, setNewMessage] = useState("")
    const { users, currentUser, setCurrentUser, messages, appendMessage } = useChatContext();

    const handleSendMessage = () => {
        if (newMessage.trim() !== "") {
            const newMsg: IMessage = {
                id: messages.length + 1,
                sender: ME,
                receiver: currentUser?.name!,
                text: newMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            appendMessage(newMsg);
            setNewMessage("")
        }
    }

    const currentContactMsgs = messages.filter(m => (m.sender === ME && m.receiver === currentUser?.name) || m.sender === currentUser?.name);
   
    return (
        <div className="flex h-[600px] max-w-4xl mx-auto border rounded-lg overflow-hidden w-full">
            {/* Contacts List */}
            <div className="w-1/3 bg-gray-100 border-r">
                <ScrollArea className="h-full">
                    {users.map(contact => (
                        <div
                            key={contact.name}
                            className={`flex items-center p-4 cursor-pointer hover:bg-gray-200 ${currentUser?.name === contact.name ? 'bg-gray-200' : ''}`}
                            onClick={() => setCurrentUser(contact)}
                        >
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={contact.avatar} alt={contact.name} />
                                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                                <div className="font-semibold">{contact.name}</div>
                                <div className="text-sm text-gray-500 truncate">{contact.lastMessage}</div>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {currentUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="ml-4 font-semibold">{currentUser.name}</div>
                            </div>
                            {/* <div>
                                <Button variant="ghost" size="icon">
                                    <Phone className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Video className="h-5 w-5" />
                                </Button>
                            </div> */}
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4">
                            {currentContactMsgs.map(message => (
                                <div
                                    key={message.id}
                                    className={`flex mb-4 ${message.sender === ME ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] p-3 rounded-lg ${message.sender === ME ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                            }`}
                                    >
                                        <p>{message.text}</p>
                                        <p className={`text-xs mt-1 ${message.sender === ME ? 'text-blue-100' : 'text-gray-500'}`}>
                                            {message.timestamp}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </ScrollArea>

                        {/* Message Input */}
                        <div className="p-4 border-t">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    handleSendMessage()
                                }}
                                className="flex items-center"
                            >
                                <Input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 mr-2"
                                />
                                <Button type="submit">
                                    <Send className="h-5 w-5" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Select a contact to start chatting
                    </div>
                )}
            </div>
        </div>
    )
}


export default function ChatDialog() {
    const { isOpen, closeChat } = useChatContext()

    return (
        <Dialog open={isOpen} onOpenChange={closeChat}>
            <DialogContent className="max-w-4xl p-0">
                <ChatComponent />
            </DialogContent>
        </Dialog>
    )
}