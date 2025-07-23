// Компонент для редактирования данных прямо в интерфейсе
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import Icon from './icon';

interface InlineEditProps {
  value: string;
  onSave: (newValue: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  type?: 'text' | 'number' | 'date';
}

const InlineEdit: React.FC<InlineEditProps> = ({ 
  value, 
  onSave, 
  placeholder = "Нажмите для редактирования", 
  className = "",
  multiline = false,
  type = 'text'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type !== 'date') {
        inputRef.current.select();
      }
    }
  }, [isEditing, type]);

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="min-h-[80px] resize-none border rounded px-2 py-1 text-sm flex-1"
            placeholder={placeholder}
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="text-sm flex-1"
            placeholder={placeholder}
          />
        )}
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            className="h-6 w-6 p-0"
          >
            <Icon name="Check" className="h-3 w-3 text-green-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            className="h-6 w-6 p-0"
          >
            <Icon name="X" className="h-3 w-3 text-red-600" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer hover:bg-accent/10 rounded p-1 transition-colors group ${className}`}
      title="Нажмите для редактирования"
    >
      <div className="flex items-center gap-2">
        <span className={value ? "" : "text-muted-foreground"}>
          {value || placeholder}
        </span>
        <Icon 
          name="Edit2" 
          className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" 
        />
      </div>
    </div>
  );
};

export default InlineEdit;