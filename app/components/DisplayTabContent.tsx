"use client";
import React, { useState, useEffect } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { motion } from "motion/react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter for navigation
import Image from "next/image";

import { Container } from "@/components/misc/Layout";
import { addItemsToCart } from "app/lib/features/cartSlice";
import { setSelectedMenu } from "app/lib/features/menuSlice";
import ChooseVariantCard from "./ChooseVariantCard";
import { useAppSelector, useAppDispatch } from "app/lib/hooks";
import { PreOrderMenuItem, menuItem } from "app/types/types";

const CardContainer = tw.div`w-full mt-10`;
const Card = tw(motion.div)`bg-gray-200 rounded-lg mx-auto overflow-hidden`;
const CardImageContainer = tw.div`relative h-32 sm:h-56 xl:h-64 w-full bg-gray-200 rounded-t overflow-hidden`;
// Horizontal layout image container for items with protein variants - shows full image
const HorizontalCardImageContainer = tw.div`relative w-full sm:w-[55%] bg-gray-200 flex-shrink-0 min-h-[320px] sm:min-h-[480px] sm:h-auto`;

const CardHoverOverlay = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.5);
  ${tw`absolute inset-0 justify-center items-center xs:hidden sm:flex`}
`;
const CardButton = tw.div`truncate text-ellipsis text-sm xs:text-xs xs:px-2 px-8 mx-auto
 py-3 font-bold rounded bg-customTheme text-gray-100 hocus:bg-primary-700 hocus:text-gray-200 focus:shadow-sm focus:outline-none transition duration-300`;
// const CardInfo = tw.div`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 p-2 bg-gray-300 rounded-lg`;

const CardText = tw.div`w-full sm:w-[45%] p-4 sm:p-6 text-gray-900 flex flex-col justify-center bg-gray-100 flex-1`;
const CardTitle = tw.h5`text-sm sm:text-2xl font-semibold text-primary-500 pb-5`;

const CardBuyButton = tw.div`flex items-center mt-4 sm:hidden`;
// const DecoratorBlob2 = styled.div`
//   ${tw`pointer-events-none -z-20 absolute left-0 bottom-0 h-80 w-80 opacity-15 transform -translate-x-60 text-primary-500`}
// `;
const DisplayTabContent: React.FC<{
  card?: menuItem;
  selectedPreOrderMenu?: PreOrderMenuItem | null | undefined;
  index: number;
  setNutrientData?: (data: {
    cals: number;
    protein: number;
    fat: number;
    carbs: number;
  }) => void; // ✅ Correct type
  onHover?: () => void;
  quantity?: number | undefined;
  isDrawerOpen?: () => void | undefined;
  openModal?: (card: menuItem) => void | undefined;
}> = ({
  card,
  selectedPreOrderMenu,
  index,
  openModal,
  quantity,
  isDrawerOpen,
  setNutrientData,
  onHover,
}) => {
  const dispatch = useAppDispatch();
  const menuType = useAppSelector((state) => state.menu.menuType);
  const router = useRouter();

  // Store calculated price and selected options for cart
  const [calculatedPrice, setCalculatedPrice] = useState<number>(
    parseFloat(String(card?.price || 0))
  );
  const [selectedProtein, setSelectedProtein] = useState<string | undefined>();
  const [selectedSize, setSelectedSize] = useState<"regular" | "jumbo">(
    "regular"
  );

  // Check if card has protein variants (needs horizontal layout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const hasProteinVariants =
    card?.proteinVariants && card.proteinVariants.length > 0;

  // Update calculated price when card changes
  useEffect(() => {
    if (card?.price) {
      setCalculatedPrice(parseFloat(String(card.price)));
    }
  }, [card?.price]);

  const renderCardButton = () => {
    switch (menuType) {
      case "restaurant":
        return <CardButton>Add to cart</CardButton>;
      case "preOrder":
        return <CardButton>{selectedPreOrderMenu?.title}</CardButton>;
      case "subscription":
        return <CardButton>More Info</CardButton>;
      default:
        return <CardButton>Unknown Menu</CardButton>;
    }
  };
  return (
    <CardContainer
      key={`${card?.title}-${index}`}
      className={hasProteinVariants ? "col-span-full max-w-[75vw] mx-auto" : ""}
      onMouseEnter={onHover}
      onMouseLeave={
        () =>
          setNutrientData?.({
            cals: 0,
            protein: 0,
            fat: 0,
            carbs: 0,
          }) // Reset when unhovered
      }
    >
      <Card
        className={`group w-full ${
          hasProteinVariants ? "flex flex-col sm:flex-row items-stretch" : ""
        }`}
        animate={"rest"}
        initial="rest"
        whileHover="hover"
      >
        {hasProteinVariants ? (
          // Horizontal layout for items with protein variants
          <>
            <HorizontalCardImageContainer className="sm:rounded-l sm:rounded-t-none rounded-t p-4 sm:p-6">
              <div className="relative w-full h-full">
                <Image
                  src={
                    card?.imagesrc?.src ??
                    selectedPreOrderMenu?.imagesrc?.src ??
                    "/fallback-image.jpg"
                  }
                  alt={card?.title ?? "Menu image"}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, 45vw"
                />
              </div>
              <CardHoverOverlay
                variants={{
                  hover: {
                    opacity: 1,
                    height: "auto",
                  },
                  rest: {
                    opacity: 0,
                    height: 0,
                  },
                }}
                transition={{ duration: 0.3 }}
                onClick={async () => {
                  if (menuType === "restaurant") {
                    if (!card) return;
                    // Generate unique cart item ID
                    const cartItemId = `${card.title}-${
                      selectedProtein || "default"
                    }-${selectedSize || "regular"}`;

                    const { meta } = await dispatch(
                      addItemsToCart({
                        ...card,
                        price: calculatedPrice.toString(), // Use calculated price instead of base price
                        quantity: quantity ?? 1, // Use quantity from props (defaults to 1)
                        selectedProtein, // Store selected protein
                        selectedSize, // Store selected size
                        cartItemId, // Store unique cart item ID
                      })
                    );
                    if (meta.requestStatus === "fulfilled") {
                      isDrawerOpen?.();
                    }
                  } else if (menuType === "subscription") {
                    router.refresh?.();
                  } else {
                    dispatch(setSelectedMenu(selectedPreOrderMenu));
                    const encodedName = encodeURIComponent(
                      selectedPreOrderMenu?.title ?? ""
                    );
                    router.push(`/preOrderMenu/${encodedName}`);
                  }
                }}
              >
                {renderCardButton()}
              </CardHoverOverlay>
            </HorizontalCardImageContainer>
            <CardText className="sm:rounded-r sm:rounded-b-none rounded-b">
              <CardTitle>{card?.title}</CardTitle>
              <ChooseVariantCard
                item={card || null}
                onPriceChange={(price, protein, size) => {
                  setCalculatedPrice(price);
                  setSelectedProtein(protein);
                  setSelectedSize(size || "regular");
                }}
              />
              {menuType === "restaurant" ? (
                <CardBuyButton>
                  <CardButton
                    onClick={() => {
                      if (!card) return;
                      // Update card with calculated price before opening modal
                      const cardWithPrice = {
                        ...card,
                        price: calculatedPrice.toString(),
                        selectedProtein,
                        selectedSize,
                      };
                      openModal?.(cardWithPrice);
                    }}
                  >
                    Add to cart
                  </CardButton>
                </CardBuyButton>
              ) : (
                <CardBuyButton>
                  <CardButton>More Info</CardButton>
                </CardBuyButton>
              )}
            </CardText>
          </>
        ) : (
          // Vertical layout for regular items
          <>
            <Container>
              <CardImageContainer>
                <Image
                  src={
                    card?.imagesrc?.src ??
                    selectedPreOrderMenu?.imagesrc?.src ??
                    "/fallback-image.jpg"
                  }
                  alt={card?.title ?? "Menu image"}
                  fill
                  className="object-cover rounded-t"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
                <CardHoverOverlay
                  variants={{
                    hover: {
                      opacity: 1,
                      height: "auto",
                    },
                    rest: {
                      opacity: 0,
                      height: 0,
                    },
                  }}
                  transition={{ duration: 0.3 }}
                  onClick={async () => {
                    if (menuType === "restaurant") {
                      if (!card) return;
                      const { meta } = await dispatch(
                        addItemsToCart({
                          ...card,
                          quantity: quantity ?? 0,
                        })
                      );
                      if (meta.requestStatus === "fulfilled") {
                        isDrawerOpen?.();
                      }
                    } else if (menuType === "subscription") {
                      router.refresh?.();
                    } else {
                      dispatch(setSelectedMenu(selectedPreOrderMenu));
                      const encodedName = encodeURIComponent(
                        selectedPreOrderMenu?.title ?? ""
                      );
                      router.push(`/preOrderMenu/${encodedName}`);
                    }
                  }}
                >
                  {renderCardButton()}
                </CardHoverOverlay>
              </CardImageContainer>
            </Container>
            {menuType === "restaurant" || "subscription" ? (
              <CardText>
                <CardTitle>{card?.title}</CardTitle>
                <ChooseVariantCard item={card || null} />
                {menuType === "restaurant" ? (
                  <CardBuyButton>
                    <CardButton
                      onClick={() => {
                        if (!card) return;
                        else openModal?.(card);
                      }}
                    >
                      Add to cart
                    </CardButton>
                  </CardBuyButton>
                ) : (
                  <CardBuyButton>
                    <CardButton>More Info</CardButton>
                  </CardBuyButton>
                )}
              </CardText>
            ) : null}
          </>
        )}
      </Card>
    </CardContainer>
  );
};
export default React.memo(DisplayTabContent);
