"use client";
import React from "react";
import tw from "twin.macro";
import styled from "styled-components";

// Base button styles matching OrderConfirmationModal design
const BaseButton = styled.button<{
  $variant?: "primary" | "secondary" | "outline";
  $fullWidth?: boolean;
}>`
  ${tw`font-bold py-3 px-6 rounded-full transition-opacity uppercase text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}

  ${(props) => {
    switch (props.$variant) {
      case "primary":
        return tw`bg-customTheme text-white`;
      case "secondary":
        return tw`bg-white text-customTheme border-2 border-customTheme`;
      case "outline":
        return tw`bg-transparent text-customTheme border-2 border-customTheme`;
      default:
        return tw`bg-customTheme text-white`;
    }
  }}
  
  ${(props) => props.$fullWidth && tw`w-full`}
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * Global Button component matching OrderConfirmationModal design
 *
 * @example
 * <Button variant="primary">TRACK ORDER</Button>
 * <Button variant="secondary">VIEW DETAILS</Button>
 */
export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  fullWidth = false,
  children,
  className,
  ...props
}) => {
  return (
    <BaseButton
      $variant={variant}
      $fullWidth={fullWidth}
      className={className}
      {...props}
    >
      {children}
    </BaseButton>
  );
};

export default Button;
