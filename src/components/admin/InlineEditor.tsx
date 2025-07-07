import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface InlineEditorProps {
  value: string;
  onSave: (value: string) => void;
  type?: "text" | "textarea" | "number";
  isAdmin: boolean;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}

const InlineEditor: React.FC<InlineEditorProps> = ({
  value,
  onSave,
  type = "text",
  isAdmin,
  className = "",
  placeholder,
  multiline = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  if (!isAdmin) {
    return <span className={className}>{value}</span>;
  }

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="relative group">
        <div className="flex items-center gap-2">
          {multiline || type === "textarea" ? (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="bg-zinc-800 border-zinc-600 text-white"
              placeholder={placeholder}
              autoFocus
            />
          ) : (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              type={type}
              className="bg-zinc-800 border-zinc-600 text-white"
              placeholder={placeholder}
              autoFocus
            />
          )}
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700"
            >
              <Icon name="Check" className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              className="border-zinc-600"
            >
              <Icon name="X" className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative group cursor-pointer hover:bg-zinc-800/50 rounded px-2 py-1 -mx-2 -my-1 transition-colors",
        className,
      )}
      onClick={() => setIsEditing(true)}
    >
      <span>{value || placeholder}</span>
      <Icon
        name="Edit"
        className="h-3 w-3 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity absolute -right-1 -top-1 bg-zinc-700 rounded p-0.5"
      />
    </div>
  );
};

export default InlineEditor;
