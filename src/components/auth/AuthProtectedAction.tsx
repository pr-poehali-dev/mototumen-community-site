import React, { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthProtectedActionProps {
  children: (props: { onClick: () => void }) => ReactNode;
  onAction: () => void;
  onShowAuth: () => void;
}

const AuthProtectedAction: React.FC<AuthProtectedActionProps> = ({
  children,
  onAction,
  onShowAuth
}) => {
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (!isAuthenticated) {
      onShowAuth();
    } else {
      onAction();
    }
  };

  return <>{children({ onClick: handleClick })}</>;
};

export default AuthProtectedAction;
