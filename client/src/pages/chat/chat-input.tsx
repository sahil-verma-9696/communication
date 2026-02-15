'use client'

import {
  useState,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { Send, Paperclip, Smile, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import EmojiPicker, { Theme } from 'emoji-picker-react'
import { ReplyPreview } from './reply-preview'

interface ChatInputProps {
  onSend: (message: string, mediaFiles?: File[]) => void
  replyingTo?: { content: string; senderName?: string } | null
  onClearReply?: () => void
  isLoading?: boolean
}

export function ChatInput({
  onSend,
  replyingTo,
  onClearReply,
  isLoading = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  const handleSend = (e: FormEvent) => {
    e.preventDefault()
    if (message.trim() || mediaFiles.length > 0) {
      onSend(message, mediaFiles.length > 0 ? mediaFiles : undefined)
      setMessage('')
      setMediaFiles([])
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setMediaFiles((prev) => [...prev, ...files])
    }
  }

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setMessage((prev) => prev + emojiObject.emoji)
  }

  const removeMediaFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="border-t bg-card p-4">
      {/* Reply Preview */}
      {replyingTo && (
        <ReplyPreview
          content={replyingTo.content}
          senderName={replyingTo.senderName}
          isOwn={true}
          onClear={onClearReply}
        />
      )}

      {/* Media Preview */}
      {mediaFiles.length > 0 && (
        <div className="mb-3 flex gap-2 flex-wrap">
          {mediaFiles.map((file, index) => (
            <div
              key={index}
              className="relative h-20 w-20 rounded-lg border border-border bg-secondary overflow-hidden"
            >
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary text-xs font-medium">
                  {file.name.split('.').pop()?.toUpperCase()}
                </div>
              )}
              <button
                onClick={() => removeMediaFile(index)}
                className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSend} className="flex gap-2 items-end">
        {/* Emoji Picker */}
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="h-9 w-9"
          >
            <Smile className="h-5 w-5" />
          </Button>
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-12 left-0 z-50"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme={Theme.LIGHT}
                height={350}
                width={320}
              />
            </div>
          )}
        </div>

        {/* File Upload */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="h-9 w-9"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf"
        />

        {/* Message Input */}
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full h-9"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend(e)
            }
          }}
        />

        {/* Send Button */}
        <Button
          type="submit"
          disabled={isLoading || (!message.trim() && mediaFiles.length === 0)}
          className="h-9 w-9 rounded-full p-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
