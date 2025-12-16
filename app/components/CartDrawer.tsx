"use client";

import tw, { styled } from "twin.macro";
import { useState, useEffect } from "react";
import { IoCloseSharp, IoTrash } from "react-icons/io5";
import PlaceOrderForm, {
  OrderConfirmationWrapper,
} from "@/components/PlaceOrderForm";
import cartEmpty from "@/images/CartEmpty.svg";
import { useAppSelector, useAppDispatch } from "app/lib/hooks";
import {
  incrementQuantity,
  decrementQuantity,
  removeItem,
} from "app/lib/features/cartSlice";
import Image from "next/image";

interface DrawerProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

// Styled Components

const CloseIcon = tw(
  IoCloseSharp
)`absolute top-2 left-5 text-2xl text-black cursor-pointer`;

const EmptyCartContainer = tw.div`flex flex-col items-center justify-center h-full text-center`;

const CartItemList = tw.ul`max-w-md divide-y divide-gray-100 mx-2 my-10`;

const CartItem = tw.li`py-3 sm:py-4`;

const ItemWrapper = tw.div`flex items-center justify-between space-x-2 `;

const ItemImage = tw.img`md:w-16 md:h-16 xs:w-8 xs:h-8 object-cover rounded`;

const ItemInfo = tw.div`flex-1 overflow-hidden`;

const ItemTitle = tw.p`text-sm md:text-xs font-medium text-gray-800 truncate`;

const ItemPrice = tw.span`text-gray-500 font-bold text-xs md:text-sm`;

const QuantityWrapper = tw.div`flex items-center space-x-2`;

const QuantityButton = tw.button`w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-400`;

const QuantityText = tw.span`px-3 py-1 bg-gray-100 text-gray-900 font-medium text-xs md:text-sm`;

const DeleteButton = tw.button`ml-2 text-customTheme hover:text-red-500 text-xl`;

const Footer = tw.div`absolute bottom-0 left-0 w-full p-4 bg-white border-t shadow-md flex items-center justify-between`;

const ContinueButton = tw.button`w-[45%] md:w-[40%] bg-customTheme text-white rounded-lg py-2 text-sm font-semibold`;

const DrawerComponent = ({ isOpen, setIsOpen }: DrawerProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden"); // Prevent background scrolling
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const totalAmt = useAppSelector((state) => state.cart.totalAmt);

  const dispatch = useAppDispatch();
  const DrawerContainer = styled.div`
    ${tw`fixed z-50 top-0 right-0 h-full bg-white shadow-2xl p-4 transition-all duration-300 ease-in-out overflow-y-auto`}
    right: ${isOpen ? "0" : "-100%"};
    ${tw`w-[80%] md:w-[60%] lg:w-[30%]`}
  `;
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setIsOpen(false)} // Close drawer on click outside
        ></div>
      )}
      <DrawerContainer>
        <CloseIcon onClick={() => setIsOpen(false)} />

        {cartItems.length === 0 ? (
          <EmptyCartContainer>
            <Image src={cartEmpty} alt="Empty cart" width={180} height={180} />
            <p tw="text-black text-lg font-bold">Your cart is empty</p>
          </EmptyCartContainer>
        ) : (
          <CartItemList>
            {cartItems.map((item) => {
              // Generate unique cart item ID
              const cartItemId =
                item.cartItemId ||
                `${item.title}-${item.selectedProtein || "default"}-${
                  item.selectedSize || "regular"
                }`;

              // Display title with protein variant if available
              const displayTitle = item.selectedProtein
                ? `${item.title} (${item.selectedProtein}${
                    item.selectedSize && item.selectedSize !== "regular"
                      ? ` - ${item.selectedSize}`
                      : ""
                  })`
                : item.title;

              return (
                <CartItem key={cartItemId}>
                  <ItemWrapper>
                    <ItemImage src={item.imagesrc.src} alt={item.title} />
                    <ItemInfo>
                      <ItemTitle>{displayTitle}</ItemTitle>
                      <ItemPrice>₹{item.price}</ItemPrice>
                    </ItemInfo>
                    <QuantityWrapper>
                      <QuantityButton
                        onClick={() => dispatch(decrementQuantity(cartItemId))}
                      >
                        -
                      </QuantityButton>
                      <QuantityText>{item.quantity}</QuantityText>
                      <QuantityButton
                        onClick={() => dispatch(incrementQuantity(cartItemId))}
                      >
                        +
                      </QuantityButton>
                    </QuantityWrapper>
                    <DeleteButton
                      onClick={() => dispatch(removeItem(cartItemId))}
                    >
                      <IoTrash />
                    </DeleteButton>
                  </ItemWrapper>
                </CartItem>
              );
            })}
          </CartItemList>
        )}

        {cartItems.length > 0 && (
          <Footer>
            <p tw="text-black text-sm font-bold">Total : ₹{totalAmt}</p>
            <ContinueButton
              onClick={() => {
                setIsModalOpen(true);
                //   setIsOpen(false);
              }}
            >
              Continue
            </ContinueButton>
          </Footer>
        )}
        <PlaceOrderForm
          isOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onOrderSubmit={() => setShowConfirmationModal(true)}
        />
        <OrderConfirmationWrapper
          showConfirmationModal={showConfirmationModal}
          setShowConfirmationModal={setShowConfirmationModal}
        />
      </DrawerContainer>
    </>
  );
};

export default DrawerComponent;
