import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  currentImage,
  className = "",
}) => {
  const [imageUrl, setImageUrl] = useState(currentImage || "");
  const [isUploading, setIsUploading] = useState(false);

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      onImageSelect(imageUrl.trim());
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageUrl(result);
        onImageSelect(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePlaceholder = () => {
    const placeholderUrl = `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`;
    setImageUrl(placeholderUrl);
    onImageSelect(placeholderUrl);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Превью изображения */}
      {imageUrl && (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Превью"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => {
              setImageUrl("");
              onImageSelect("");
            }}
          >
            <Icon name="X" className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Загрузка по URL */}
      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL изображения</Label>
        <div className="flex gap-2">
          <Input
            id="imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Button onClick={handleUrlSubmit} disabled={!imageUrl.trim()}>
            <Icon name="Link" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Загрузка файла */}
      <div className="space-y-2">
        <Label htmlFor="imageFile">Загрузить файл</Label>
        <div className="flex gap-2">
          <Input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-accent file:text-accent-foreground"
          />
          {isUploading && (
            <div className="flex items-center">
              <Icon name="Loader2" className="h-4 w-4 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Генерация плейсхолдера */}
      <div className="space-y-2">
        <Label>Или используйте случайное изображение</Label>
        <Button
          variant="outline"
          onClick={generatePlaceholder}
          className="w-full"
        >
          <Icon name="Image" className="h-4 w-4 mr-2" />
          Сгенерировать плейсхолдер
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
