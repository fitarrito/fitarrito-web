"use client";
import React from "react";
import ReactModal from "react-modal";
import tw from "twin.macro";
import { useRouter } from "next/navigation";
import { FaExclamationTriangle } from "react-icons/fa";
import Button from "./ui/Button";

// Type assertion to fix TypeScript compatibility issue with react-modal
const Modal = ReactModal as unknown as React.ComponentType<ReactModal.Props>;

// Styled Components
const ModalContainer = tw.div`bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative`;
const IconContainer = tw.div`flex justify-center mb-4`;
const WarningIcon = tw.div`w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center`;
const Title = tw.h2`text-2xl font-bold text-gray-900 mb-4 text-center`;
const Message = tw.p`text-gray-600 text-center mb-6 leading-relaxed`;
const ButtonContainer = tw.div`flex gap-4 mt-6`;

interface SignInWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn?: () => void;
}

export default function SignInWarningModal({
  isOpen,
  onClose,
  onSignIn,
}: SignInWarningModalProps) {
  const router = useRouter();
  const appRoot =
    typeof document !== "undefined"
      ? document.getElementById("__next") || document.body
      : undefined;

  const handleSignIn = () => {
    onClose();
    if (onSignIn) {
      onSignIn();
    } else {
      router.push("/signin");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      appElement={appRoot}
      className="outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      style={{
        content: {
          position: "relative",
          inset: "auto",
          border: "none",
          background: "transparent",
          padding: 0,
          width: "100%",
          maxWidth: "28rem",
        },
      }}
    >
      <ModalContainer>
        <IconContainer>
          <WarningIcon>
            <FaExclamationTriangle className="text-yellow-600 text-3xl" />
          </WarningIcon>
        </IconContainer>
        <Title>Sign In Required</Title>
        <Message>
          Please sign in to add items to your cart. This helps us provide you
          with a better shopping experience and allows you to track your orders.
        </Message>

        <ButtonContainer>
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSignIn} className="flex-1">
            Sign In
          </Button>
        </ButtonContainer>
      </ModalContainer>
    </Modal>
  );
}
