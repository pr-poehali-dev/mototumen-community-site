import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import ImageUpload from "@/components/ui/ImageUpload";
import { UserProfile } from "@/types/profile";

interface ProfileInfoProps {
  user: UserProfile;
  onUserUpdate: (updatedUser: Partial<UserProfile>) => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user, onUserUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio,
    phone: user.phone,
    address: {
      street: user.address.street,
      city: user.address.city,
      zipCode: user.address.zipCode,
      country: user.address.country,
    },
  });

  const handleSave = async () => {
    onUserUpdate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      bio: formData.bio,
      phone: formData.phone,
      address: formData.address,
    });
    setIsEditing(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500";
      case "moderator":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "Администратор";
      case "moderator":
        return "Модератор";
      default:
        return "Пользователь";
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <CardTitle className="text-lg sm:text-xl">
            Информация о профиле
          </CardTitle>
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="w-full sm:w-auto"
          >
            <Icon name={isEditing ? "Save" : "Edit"} className="h-4 w-4 mr-2" />
            {isEditing ? "Сохранить" : "Редактировать"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
              <AvatarImage src={user.photoUrl} alt={user.firstName} />
              <AvatarFallback className="bg-zinc-800 text-white text-lg sm:text-xl">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 sm:flex-initial">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-white">
                  {user.firstName} {user.lastName}
                </h3>
                <Badge
                  className={`${getRoleColor(user.role)} text-white w-fit`}
                >
                  {getRoleText(user.role)}
                </Badge>
              </div>
              <p className="text-sm sm:text-base text-zinc-400 mt-1">
                @{user.username}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <Label htmlFor="firstName">Имя</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              disabled={!isEditing}
              className="bg-zinc-800 border-zinc-700 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Фамилия</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              disabled={!isEditing}
              className="bg-zinc-800 border-zinc-700 mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={user.email}
            disabled
            className="bg-zinc-800 border-zinc-700 mt-1"
          />
        </div>

        <div>
          <Label htmlFor="phone">Телефон</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            disabled={!isEditing}
            className="bg-zinc-800 border-zinc-700 mt-1"
          />
        </div>

        <div>
          <Label htmlFor="bio">О себе</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            disabled={!isEditing}
            className="bg-zinc-800 border-zinc-700 mt-1 min-h-[100px]"
            placeholder="Расскажите о себе..."
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">Адрес</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="street">Улица</Label>
              <Input
                id="street"
                value={formData.address.street}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value },
                  })
                }
                disabled={!isEditing}
                className="bg-zinc-800 border-zinc-700 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="city">Город</Label>
              <Input
                id="city"
                value={formData.address.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value },
                  })
                }
                disabled={!isEditing}
                className="bg-zinc-800 border-zinc-700 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="zipCode">Почтовый индекс</Label>
              <Input
                id="zipCode"
                value={formData.address.zipCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, zipCode: e.target.value },
                  })
                }
                disabled={!isEditing}
                className="bg-zinc-800 border-zinc-700 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="country">Страна</Label>
              <Input
                id="country"
                value={formData.address.country}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, country: e.target.value },
                  })
                }
                disabled={!isEditing}
                className="bg-zinc-800 border-zinc-700 mt-1"
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleSave}
              className="bg-orange-500 hover:bg-orange-600 flex-1 sm:flex-initial"
            >
              <Icon name="Save" className="h-4 w-4 mr-2" />
              Сохранить изменения
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="flex-1 sm:flex-initial"
            >
              <Icon name="X" className="h-4 w-4 mr-2" />
              Отмена
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;
