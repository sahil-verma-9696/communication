import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReplyPreviewProps {
  content: string
  isOwn: boolean
  senderName?: string
  onClear?: () => void
  inMessage?: boolean
}

export function ReplyPreview({ content,  senderName, onClear, inMessage }: ReplyPreviewProps) {
  if (inMessage) {
    // Inline reply preview shown with the message
    return (
      <div className="flex items-start gap-2 border-l-4 border-blue-400 bg-muted/50 px-3 py-2 rounded-md mb-2">
        <div className="flex-1 flex flex-col">
          <p className="text-xs font-semibold text-muted-foreground">
            {senderName ? `Reply to ${senderName}` : 'Replying to'}
          </p>
          <p className="text-sm text-foreground truncate max-w-xs">{content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950 px-4 py-3 rounded-md mb-3">
      <div className="flex items-start gap-3">
        <div className="flex-1 flex flex-col">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            {senderName ? `Replying to ${senderName}` : 'Replying to'}
          </p>
          <p className="text-sm text-foreground truncate max-w-2xl">{content}</p>
        </div>
        {onClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-6 w-6 p-0 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
