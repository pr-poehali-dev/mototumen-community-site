import React, { useState } from "react";
import ProfileDropdown from "./user-profile/ProfileDropdown";
import ProfileModal from "./user-profile/ProfileModal";
import { useUserData } from "@/hooks/useUserData";
import { TelegramUser } from "@/types/user";

interface UserProfileProps {
  user: TelegramUser;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { userStats, recentActivities, userOrders, userInitials, fullName } =
    useUserData(user);

  const handleProfileOpen = () => setIsProfileOpen(true);
  const handleProfileClose = () => setIsProfileOpen(false);

  return (
    <>
      <ProfileDropdown
        user={user}
        fullName={fullName}
        userInitials={userInitials}
        onProfileOpen={handleProfileOpen}
        onLogout={onLogout}
      />
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={handleProfileClose}
        user={user}
        fullName={fullName}
        userInitials={userInitials}
        userStats={userStats}
        activities={recentActivities}
        orders={userOrders}
      />
    </>
  );
};

export default UserProfile;
