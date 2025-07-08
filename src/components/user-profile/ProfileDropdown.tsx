import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Icon from "@/components/ui/icon";
import { UserProfile } from "@/contexts/AuthContext";

interface ProfileDropdownProps {
  user: UserProfile;
  fullName: string;
  userInitials: string;
  onLogout: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  user,
  fullName,
  userInitials,
  onLogout,
}) => {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-2 hover:bg-zinc-800">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photo_url} alt={fullName} />
              <AvatarFallback className="bg-accent text-white text-sm">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="text-left hidden md:block">
              <div className="text-sm font-medium text-white">{fullName}</div>
              <div className="text-xs text-zinc-400">
                {user.username ? `@${user.username}` : "Байкер"}
              </div>
            </div>
            <Icon name="ChevronDown" className="h-4 w-4 text-zinc-400" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-zinc-900 border-zinc-700"
      >
        <DropdownMenuItem
          onClick={() => navigate("/profile")}
          className="cursor-pointer"
        >
          <Icon name="User" className="h-4 w-4 mr-2" />
          Личный кабинет
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Icon name="Settings" className="h-4 w-4 mr-2" />
          Настройки
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Icon name="Bell" className="h-4 w-4 mr-2" />
          Уведомления
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-700" />
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer text-red-400"
        >
          <Icon name="LogOut" className="h-4 w-4 mr-2" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
