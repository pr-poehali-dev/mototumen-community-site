import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface AdminOverlayProps {
  isVisible: boolean;
  onToggle: () => void;
  onOpenAdminPanel: () => void;
  className?: string;
}

const AdminOverlay: React.FC<AdminOverlayProps> = ({
  isVisible,
  onToggle,
  onOpenAdminPanel,
  className = "",
}) => {
  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        className={cn(
          "fixed bottom-4 right-4 z-40 bg-accent hover:bg-accent/80 rounded-full w-12 h-12 shadow-lg",
          className,
        )}
        size="sm"
      >
        <Icon name="Shield" className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Card
      className={cn(
        "fixed bottom-4 right-4 z-40 bg-zinc-900 border-zinc-700 p-4 shadow-xl min-w-64",
        className,
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center">
            <Icon name="Shield" className="h-4 w-4 mr-2 text-accent" />
            Админ-панель
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-6 w-6 p-0"
          >
            <Icon name="X" className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-2">
          <Button
            onClick={onOpenAdminPanel}
            className="w-full justify-start bg-accent hover:bg-accent/80"
            size="sm"
          >
            <Icon name="Settings" className="h-4 w-4 mr-2" />
            Открыть панель
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-zinc-600 text-zinc-300"
            size="sm"
            onClick={() => {
              // Включить режим редактирования на странице
              document.body.classList.toggle("admin-edit-mode");
              const event = new CustomEvent("admin-edit-toggle");
              window.dispatchEvent(event);
            }}
          >
            <Icon name="Edit" className="h-4 w-4 mr-2" />
            Редактировать страницу
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-zinc-600 text-zinc-300"
            size="sm"
          >
            <Icon name="Eye" className="h-4 w-4 mr-2" />
            Предпросмотр
          </Button>
        </div>

        <div className="text-xs text-zinc-500 pt-2 border-t border-zinc-700">
          Нажмите ESC для выхода из режима редактирования
        </div>
      </div>
    </Card>
  );
};

export default AdminOverlay;
