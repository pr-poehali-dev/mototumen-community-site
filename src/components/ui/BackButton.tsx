import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  onClick?: () => void;
  className?: string;
  showText?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({
  to,
  onClick,
  className = "",
  showText = true,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={`text-zinc-400 hover:text-white hover:bg-zinc-800 ${className}`}
    >
      <Icon name="ArrowLeft" className="h-4 w-4" />
      {showText && <span className="ml-2">Назад</span>}
    </Button>
  );
};

export default BackButton;