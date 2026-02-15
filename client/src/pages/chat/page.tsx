import { useState } from 'react'
import { ChatHeader } from './chat-header'
import { ChatMessages } from './chat-messages'
import { ChatInput } from './chat-input'

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
  senderName?: string
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hey! How are you doing?',
      timestamp: '2:30 PM',
      isOwn: false,
      type: 'text',
      senderName: 'Sarah Anderson',
    },
    {
      id: '2',
      content: 'I\'m doing great! Just finished the project.',
      timestamp: '2:32 PM',
      isOwn: true,
      type: 'text',
      senderName: 'You',
    },
    {
      id: '3',
      content: 'Amazing! Can you share the files?',
      timestamp: '2:33 PM',
      isOwn: false,
      type: 'text',
      senderName: 'Sarah Anderson',
      replyTo: {
        content: 'I\'m doing great! Just finished the project.',
        senderName: 'You',
        messageId: '2',
      },
    },
    {
      id: '4',
      content: 'Check out this design mockup!',
      timestamp: '2:35 PM',
      isOwn: true,
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop',
      senderName: 'You',
      replyTo: {
        content: 'Amazing! Can you share the files?',
        senderName: 'Sarah Anderson',
        messageId: '3',
      },
    },
    {
      id: '5',
      content: 'design-document.pdf',
      timestamp: '2:36 PM',
      isOwn: true,
      type: 'pdf',
      senderName: 'You',
    },
    {
      id: '6',
      content: 'Check out this article about design',
      timestamp: '2:37 PM',
      isOwn: false,
      type: 'link',
      linkTitle: 'The Complete Guide to Modern UI Design',
      linkDescription: 'Learn the fundamentals of user interface design in 2024',
      linkUrl: 'https://example.com/design-guide',
      senderName: 'Sarah Anderson',
    },
  ])

  const [replyingTo, setReplyingTo] = useState<Message | null>(null)

  const handleSendMessage = (messageText: string, mediaFiles?: File[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageText || (mediaFiles?.[0]?.name || 'Media'),
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isOwn: true,
      type: mediaFiles
        ? mediaFiles[0].type.startsWith('image/')
          ? 'image'
          : 'pdf'
        : 'text',
      mediaUrl: mediaFiles && mediaFiles[0].type.startsWith('image/')
        ? URL.createObjectURL(mediaFiles[0])
        : undefined,
      senderName: 'You',
      replyTo: replyingTo ? {
        content: replyingTo.content,
        senderName: replyingTo.senderName,
        messageId: replyingTo.id,
      } : undefined,
    }

    setMessages((prev) => [...prev, newMessage])
    setReplyingTo(null)
  }

  const handleReply = (message: Message) => {
    setReplyingTo(message)
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <ChatHeader
        userName="Sarah Anderson"
        userStatus="online"
        lastSeen="5 min ago"
        userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
      />
      <ChatMessages messages={messages} onReply={handleReply} replyingTo={replyingTo} />
      <ChatInput
        onSend={handleSendMessage}
        replyingTo={replyingTo}
        onClearReply={() => setReplyingTo(null)}
      />
    </div>
  )
}
