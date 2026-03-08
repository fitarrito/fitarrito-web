"use client";
import React from "react";
import tw from "twin.macro";
import styled from "styled-components";

interface CardContainerProps {
  $variant?: "light" | "dark"; // Kept for backward compatibility but no longer used
}

const CardContainer = styled.div<CardContainerProps>`
  ${tw`rounded-lg flex flex-col relative`}
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  min-height: 180px;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s, color 0.2s;
  background-color: #fc1e1e;
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.12);
    background-color: white !important;
    color: #333333;

    div {
      color: #333333;
    }

    svg {
      color: #333333;
      fill: #333333;
    }
  }
`;

const IconContainer = styled.div`
  ${tw`absolute top-4 left-4`}
  font-size: 3.5rem;
  color: white;
  transition: color 0.2s;
  z-index: 1;
`;

const PrimaryText = styled.div`
  ${tw`absolute bottom-4 right-4`}
  font-size: 1.4rem;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", sans-serif;
  color: white;
  line-height: 1.3;
  text-align: right;
  transition: color 0.2s;
  max-width: 75%;
  letter-spacing: -0.02em;
  word-wrap: break-word;
`;

const SecondaryText = styled.div`
  ${tw`text-center`}
  font-size: 0.875rem;
  font-weight: 400;
  color: #757575;
  line-height: 1.4;
  margin-top: 0.5rem;
`;

interface CardProps {
  primaryText: string;
  secondaryText?: string;
  variant?: "light" | "dark";
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Card component with light and dark variants
 *
 * @example
 * <Card
 *   primaryText="Order your meal today"
 *   variant="light"
 * />
 * <Card
 *   primaryText="Subscription onboarding form"
 *   variant="dark"
 *   icon={<FaIcon />}
 * />
 */
export const Card: React.FC<CardProps> = ({
  primaryText,
  secondaryText,
  variant = "light",
  icon,
  className,
  onClick,
}) => {
  return (
    <CardContainer
      $variant={variant}
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {icon && <IconContainer>{icon}</IconContainer>}
      <PrimaryText>{primaryText}</PrimaryText>
      {secondaryText && <SecondaryText>{secondaryText}</SecondaryText>}
    </CardContainer>
  );
};

export default Card;
