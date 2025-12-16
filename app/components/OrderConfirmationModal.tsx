"use client";
import React from "react";
import Modal from "react-modal";
import tw from "twin.macro";
import Image from "next/image";

// Styled Components
const ModalContainer = tw.div`rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden`;
const FoodIllustrationsContainer = tw.div`relative h-48 flex items-center justify-center overflow-hidden my-4`;
const ContentContainer = tw.div`px-8 pb-8 text-center`;
const Heading = tw.h2`text-base font-bold text-white mb-2`;
const SubText = tw.p`text-white text-sm  leading-relaxed`;
const BoldText = tw.span`font-bold`;
const ButtonContainer = tw.div`flex gap-4 mt-6`;
const ViewDetailsButton = tw.button`flex-1 text-white font-bold py-3 px-6 rounded-full hover:opacity-90 transition-opacity uppercase text-sm`;
const TrackOrderButton = tw.button`flex-1 font-bold py-3 px-6 rounded-full hover:opacity-90 transition-opacity uppercase text-sm`;

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  estimatedTime?: number; // in minutes
}

export default function OrderConfirmationModal({
  isOpen,
  onClose,
  estimatedTime = 15,
}: OrderConfirmationModalProps) {
  const appRoot =
    typeof document !== "undefined"
      ? document.getElementById("__next") || document.body
      : undefined;

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
      <ModalContainer
        style={{
          background: "linear-gradient(180deg, #dd3a28 0%, #c92115 100%)",
        }}
      >
        {/* Food Illustrations Section */}
        <FoodIllustrationsContainer>
          <Image
            src="/food-illustration.png"
            alt="Food illustration"
            fill
            style={{
              objectFit: "contain",
              objectPosition: "center",
            }}
            className="opacity-90"
          />
        </FoodIllustrationsContainer>

        {/* Content Section */}
        <ContentContainer>
          <Heading>Your order is being prepared!</Heading>
          <SubText>
            Your food will be ready for pickup in{" "}
            <BoldText>{estimatedTime} minutes</BoldText>.
          </SubText>
          <SubText>
            We&apos;ll notify you when your driver is on the way.
          </SubText>

          {/* Buttons */}
          <ButtonContainer>
            <ViewDetailsButton
              onClick={onClose}
              style={{
                background: "linear-gradient(180deg, #FF4F40 0%, #E03E33 100%)",
              }}
            >
              VIEW DETAILS
            </ViewDetailsButton>
            <TrackOrderButton
              onClick={onClose}
              style={{
                background: "linear-gradient(180deg, #fef5f5 0%, #f5e8e6 100%)",
                color: "#8B4513",
              }}
            >
              TRACK ORDER
            </TrackOrderButton>
          </ButtonContainer>
        </ContentContainer>
      </ModalContainer>
    </Modal>
  );
}
