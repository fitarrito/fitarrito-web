"use client";

import React, { useState } from "react";
import Modal from "react-modal";
import tw, { styled } from "twin.macro";

interface CardItem {
  title: string;
  imagesrc: { src: string };
  content: string;
  price: number | string;
  rating: number | string;
  reviews: string;
  nutrient?: {
    regular: { cals: string; protein: string; fat: string; carbs: string };
    jumbo: { cals: string; protein: string; fat: string; carbs: string };
  };
}

interface CartModalProps {
  isOpen: boolean;
  closeModal: () => void;
  selectedCard: CardItem | null;
}

const ModalContainer = styled.div`
  ${tw`bg-white rounded-lg p-4 w-[95%] max-h-[90vh] overflow-y-auto relative`}
  ${tw`md:w-[75%] lg:w-[30%]`}
`;

const appRoot =
  typeof document !== "undefined"
    ? document.getElementById("__next") || document.body
    : undefined;

const CaloriesModal: React.FC<CartModalProps> = ({
  isOpen,
  closeModal,
  selectedCard,
}) => {
  const [variant, setVariant] = useState<"regular" | "jumbo">("regular");

  return (
    <Modal
      appElement={appRoot}
      isOpen={isOpen}
      onRequestClose={closeModal}
      className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <ModalContainer>
        <h2 className="text-lg font-bold">Nutritional Information</h2>

        {selectedCard?.nutrient && (
          <div className="mt-4">
            {/* Radio buttons for selecting variant */}
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="variant"
                  value="regular"
                  checked={variant === "regular"}
                  onChange={() => setVariant("regular")}
                />
                Mini
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="variant"
                  value="jumbo"
                  checked={variant === "jumbo"}
                  onChange={() => setVariant("jumbo")}
                />
                Regular
              </label>
            </div>

            {/* Display selected variant nutrition */}
            <h3 className="font-semibold capitalize">{variant}</h3>
            <p>Calories: {selectedCard.nutrient[variant]?.cals || "N/A"}</p>
            <p>Protein: {selectedCard.nutrient[variant]?.protein || "N/A"}</p>
            <p>Fat: {selectedCard.nutrient[variant]?.fat || "N/A"}</p>
            <p>Carbs: {selectedCard.nutrient[variant]?.carbs || "N/A"}</p>
          </div>
        )}

        <button
          className="bg-red-500 text-white py-2 px-4 rounded mt-4"
          onClick={closeModal}
        >
          Close
        </button>
      </ModalContainer>
    </Modal>
  );
};

export default CaloriesModal;
