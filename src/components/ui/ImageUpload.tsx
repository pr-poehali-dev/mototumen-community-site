import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  onImageDelete?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  allowUrl?: boolean;
  allowUpload?: boolean;
  variant?: "default" | "compact";
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageChange,
  onImageDelete,
  className = "",
  size = "md",
  allowUrl = true,
  allowUpload = true,
  variant = "default",
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Имитация загрузки файла
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageChange(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      onImageChange(imageUrl.trim());
      setImageUrl("");
    }
  };

  const handleDelete = () => {
    if (onImageDelete) {
      onImageDelete();
    } else {
      onImageChange("");
    }
  };

  if (variant === "compact") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <Icon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Icon name="Upload" className="h-4 w-4 mr-2" />
            )}
            {isUploading ? "Загрузка..." : "Выбрать файл"}
          </Button>

          {currentImage && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-400 hover:text-red-300"
            >
              <Icon name="X" className="h-4 w-4" />
            </Button>
          )}
        </div>

        {currentImage && (
          <div className="w-full h-32 rounded-lg overflow-hidden border border-zinc-700">
            <img
              src={currentImage}
              alt="Предпросмотр"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Превью изображения */}
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "border-2 border-dashed border-zinc-600 rounded-lg flex items-center justify-center overflow-hidden",
            sizeClasses[size],
          )}
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon name="Image" className="h-8 w-8 text-zinc-500" />
          )}
        </div>

        {currentImage && (
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Icon name="Edit" className="h-4 w-4 mr-2" />
              Изменить
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
            >
              <Icon name="Trash2" className="h-4 w-4 mr-2" />
              Удалить
            </Button>
          </div>
        )}
      </div>

      {/* Загрузка файла */}
      {allowUpload && (
        <div>
          <Label className="text-sm font-medium text-zinc-300">
            Загрузить файл
          </Label>
          <div className="flex gap-2 mt-1">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Icon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <Icon name="Upload" className="h-4 w-4 mr-2" />
                  Выбрать файл
                </>
              )}
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* URL изображения */}
      {allowUrl && (
        <div>
          <Label className="text-sm font-medium text-zinc-300">
            Или введите URL изображения
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="bg-zinc-900 border-zinc-600"
            />
            <Button
              onClick={handleUrlSubmit}
              disabled={!imageUrl.trim()}
              size="sm"
            >
              <Icon name="Plus" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
