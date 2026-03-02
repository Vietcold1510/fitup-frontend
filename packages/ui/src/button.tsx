import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  appName?: string; // optional prop referenced by original example
}

export const Button: React.FC<ButtonProps> = ({ children, appName, ...rest }) => {
  return (
    <button {...rest}>
      {children}
    </button>
  );
};
