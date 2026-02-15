import { useRef, useEffect } from 'react'
import { MessageBubble } from './message-bubble'

interface Message {
  id: string
  content: string
  timestamp: string
  isOwn: boolean
  type?: 'text' | 'image' | 'pdf' | 'link'
  mediaUrl?: string
  linkTitle?: string
  linkDescription?: string
  linkUrl?: string
  replyTo?: {
    content: string
    senderName?: string
    messageId?: string
  }
}

interface ChatMessagesProps {
  messages: Message[]
  onReply?: (message: Message) => void
  replyingTo?: Message | null
}

export function ChatMessages({ messages, onReply }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto space-y-4 bg-background p-4"
    >
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground text-center">
            No messages yet. Start the conversation!
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <div key={message.id}>
            <MessageBubble
              content={message.content}
              timestamp={message.timestamp}
              isOwn={message.isOwn}
              type={message.type}
              mediaUrl={message.mediaUrl}
              linkTitle={message.linkTitle}
              linkDescription={message.linkDescription}
              linkUrl={message.linkUrl}
              replyTo={message.replyTo}
              onReply={() => onReply?.(message)}
            />
          </div>
        ))
      )}
    </div>
  )
}
