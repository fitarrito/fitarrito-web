"use client";

import React from "react";
import tw, { styled } from "twin.macro";
import Modal from "react-modal";
import { useAppDispatch } from "app/lib/hooks";
import { addItemsToCart } from "app/lib/features/cartSlice";
import { menuItem } from "@/types/types";

interface CartModalProps {
  isOpen: boolean;
  closeModal: () => void;
  selectedCard: menuItem | null;
  quantity: number;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
}

// Styled Components
const ModalContainer = styled.div`
  ${tw`bg-white rounded-lg p-4 w-[95%] max-h-[90vh] overflow-y-auto relative`}
  ${tw`md:w-[75%] lg:w-[50%]`}
`;

const CloseButton = tw.button`absolute top-4 right-6 text-gray-500 hover:text-gray-700 text-2xl`;

const Title = tw.h2`text-lg md:text-xl font-semibold`;

const ProductImage = tw.img`w-full h-52 md:h-64 object-cover rounded`;

// const ModifiersContainer = tw.div`mt-4`;

// const CheckboxLabel = tw.label`flex items-center mt-2 text-sm md:text-base`;

const QuantityWrapper = tw.div`flex items-center`;

const QuantityButton = tw.button`px-3 py-1 md:px-4 md:py-2 bg-gray-300 text-gray-700 rounded-full focus:outline-none hover:bg-gray-400`;

const QuantityText = tw.span`px-4 py-2 bg-gray-100 text-gray-900 font-semibold mx-2`;

const ActionButton = tw.button`md:px-8 xs:px-4 md:px-10 py-2 md:py-3 bg-customTheme md:text-sm xs:text-xs text-white rounded-full mx-2`;

const ButtonGroup = tw.div`flex justify-between mt-6 items-center`;

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  closeModal,
  selectedCard,
  quantity,
  incrementQuantity,
  decrementQuantity,
}) => {
  const dispatch = useAppDispatch();

  if (!selectedCard) return null;

  const appRoot =
    typeof document !== "undefined"
      ? document.getElementById("__next") || document.body
      : undefined;

  return (
    <Modal
      appElement={appRoot}
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Cart Modal"
      className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <ModalContainer>
        <CloseButton onClick={closeModal}>&times;</CloseButton>

        <div tw="mb-2">
          <Title>{selectedCard.title}</Title>
        </div>

        <ProductImage
          src={selectedCard.imagesrc.src}
          alt={selectedCard.title}
        />
        {/* 
        <ModifiersContainer>
          <p tw="font-semibold text-gray-700">Packing Modifiers (Optional)</p>
          <CheckboxLabel>
            <input type="checkbox" className="mr-2" /> YES! Utensils
          </CheckboxLabel>
          <CheckboxLabel>
            <input type="checkbox" className="mr-2" /> NO! Utensils
          </CheckboxLabel>
        </ModifiersContainer> */}

        <ButtonGroup>
          <QuantityWrapper>
            <QuantityButton onClick={decrementQuantity}>-</QuantityButton>
            <QuantityText>{quantity}</QuantityText>
            <QuantityButton onClick={incrementQuantity}>+</QuantityButton>
          </QuantityWrapper>
          <ActionButton
            onClick={async () => {
              // Generate unique cart item ID
              const cartItemId = `${selectedCard.title}-${
                selectedCard.selectedProtein || "default"
              }-${selectedCard.selectedSize || "regular"}`;

              const { meta } = await dispatch(
                addItemsToCart({
                  ...selectedCard,
                  quantity: quantity,
                  cartItemId, // Store unique cart item ID
                })
              );
              if (meta.requestStatus === "fulfilled") {
                closeModal();
              }
            }}
          >
            Add To Cart -{" "}
            {isNaN(Number(selectedCard.price)) || isNaN(Number(quantity))
              ? "Invalid Price"
              : (Number(selectedCard.price) * Number(quantity)).toFixed(2)}
          </ActionButton>
        </ButtonGroup>
      </ModalContainer>
    </Modal>
  );
};

export default CartModal;
