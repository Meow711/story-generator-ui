'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useChatContext } from '../chat/context'
import CharacterProfileSM from './character_sm'

interface Node {
    id: string
    text: string
    scene: string
    entities: string[]
    children: Node[]
}

const NodeViewer = ({ node, idx }: { node: Node, idx?: number }) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const toggleExpand = () => setIsExpanded(!isExpanded)
    const { users } = useChatContext();

    const findUser = (name: string) => {
        return users.find(u => u.name === name);
    }

    return (
        <div className="border rounded-md p-4 mb-4 shadow-sm">
            <div className="font-bold mb-2 text-xs">{typeof idx === "number" ? `${idx} - ` : null}ID: {node.id}</div>
            <div className="space-y-2">
                <Textarea
                    value={node.text}
                    readOnly
                    placeholder="Node text"
                    className="w-full min-h-[100px]"
                />
                <Textarea
                    value={node.scene}
                    readOnly
                    placeholder="Scene description"
                    className="w-full min-h-[100px]"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {node.entities.map(et => {
                    const u = findUser(et);
                    return u ? <CharacterProfileSM name={u.name} avatar={u.avatar} onDelete={() => { }} /> : null
                })}
            </div>
            {node.children.length > 0 && (
                <div className="mt-2">
                    <Button variant="outline" size="sm" onClick={toggleExpand} className="w-full justify-between">
                        {isExpanded ? 'Collapse' : 'Expand'} {node.children.length} Children
                        {isExpanded ? <ChevronDown className="h-4 w-4 ml-2" /> : <ChevronRight className="h-4 w-4 ml-2" />}
                    </Button>
                </div>
            )}
            {isExpanded && node.children.length > 0 && (
                <div className="mt-4 ml-4 border-l pl-4">
                    {node.children.map((child, index) => (
                        <NodeViewer key={child.id} node={child} idx={index} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default function Outline({ data }: { data: Node }) {
    return <NodeViewer node={data} />
}