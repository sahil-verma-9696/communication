import { Phone, Video, MoreVertical, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface ChatHeaderProps {
  userStatus?: 'online' | 'offline' | 'away'
  lastSeen?: string
  userName?: string
  userAvatar?: string
}

export function ChatHeader({
  userStatus = 'online',
  lastSeen = '5 min ago',
  userName = 'John Doe',
  userAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
}: ChatHeaderProps) {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
  }

  return (
    <div className="flex items-center justify-between border-b bg-card p-4">
      {/* Left: User Profile Section */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar>
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
              statusColors[userStatus]
            }`}
          />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">{userName}</h2>
          <p className="text-xs text-muted-foreground">
            {userStatus === 'online'
              ? 'Online'
              : userStatus === 'away'
                ? 'Away'
                : `Last seen ${lastSeen}`}
          </p>
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Video className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
            <DropdownMenuItem>Clear Chat</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Block User</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
