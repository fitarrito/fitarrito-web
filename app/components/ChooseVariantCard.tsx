"use client";

import { useState, useMemo, useEffect } from "react";
import tw from "twin.macro";
import Image from "next/image";
import { useAppSelector } from "app/lib/hooks";
import { menuItem, ProteinVariant } from "@/types/types";

interface ChooseVariantCardProps {
  item: menuItem | null;
  onPriceChange?: (
    price: number,
    selectedProtein?: string,
    size?: "regular" | "jumbo"
  ) => void;
}

const ChooseVariantCard: React.FC<ChooseVariantCardProps> = ({
  item,
  onPriceChange,
}) => {
  // State for the selected variant of this specific item
  const CardInfo = tw.div`grid grid-cols-4 gap-2 sm:gap-4 mt-4 p-3 sm:p-4 bg-gray-300 rounded-lg`;
  const CardPrice = tw.p`text-lg font-semibold text-gray-900`;
  const SizeLabel = tw.label`flex items-center gap-2 cursor-pointer`;

  const menuType = useAppSelector((state) => state.menu.menuType);

  const [variant, setVariant] = useState<"regular" | "jumbo">("regular");
  const [selectedProtein, setSelectedProtein] = useState<string | null>(
    item?.proteinVariants && item.proteinVariants.length > 0
      ? item.proteinVariants[0].name
      : null
  );

  // Get current nutrient data based on protein and size selection
  // For Taco items, always use "regular" variant since they don't have size options
  const currentNutrient = useMemo(() => {
    const sizeVariant = item?.title?.toLowerCase().includes("taco")
      ? "regular"
      : variant;
    if (item?.proteinVariants && selectedProtein) {
      const protein = item.proteinVariants.find(
        (p) => p.name === selectedProtein
      );
      return protein?.nutrient[sizeVariant];
    }
    return item?.nutrient?.[sizeVariant];
  }, [item, selectedProtein, variant]);

  // Calculate total price: base item price + selected protein price
  const totalPrice = useMemo(() => {
    const basePrice = parseFloat(String(item?.price || 0));
    if (item?.proteinVariants && selectedProtein) {
      const protein = item.proteinVariants.find(
        (p) => p.name === selectedProtein
      );
      const sizeVariant = item?.title?.toLowerCase().includes("taco")
        ? "regular"
        : variant;
      const proteinPrice = parseFloat(
        protein?.nutrient[sizeVariant].price || "0"
      );
      return basePrice + proteinPrice;
    }
    return basePrice;
  }, [
    item?.price,
    item?.proteinVariants,
    selectedProtein,
    variant,
    item?.title,
  ]);

  // Notify parent component of price changes
  useEffect(() => {
    if (onPriceChange) {
      const sizeVariant = item?.title?.toLowerCase().includes("taco")
        ? "regular"
        : variant;
      onPriceChange(totalPrice, selectedProtein || undefined, sizeVariant);
    }
  }, [totalPrice, selectedProtein, variant, item?.title, onPriceChange]);

  // Check if item has size variants (different prices for regular/jumbo)
  const hasSizeVariants = useMemo(() => {
    // Hide size selection for Taco items
    if (item?.title?.toLowerCase().includes("taco")) {
      return false;
    }
    // If item has protein variants, check if any protein has different prices
    if (item?.proteinVariants && item.proteinVariants.length > 0) {
      return item.proteinVariants.some(
        (protein) =>
          protein.nutrient.regular.price !== protein.nutrient.jumbo.price
      );
    }
    // Otherwise check base nutrient
    if (!item?.nutrient) return false;
    const regularPrice = item.nutrient.regular?.price;
    const jumboPrice = item.nutrient.jumbo?.price;
    return regularPrice !== jumboPrice;
  }, [item?.nutrient, item?.proteinVariants, item?.title]);

  function NutrientBadge({ label, value }: { label: string; value: string }) {
    return (
      <div className="text-center min-w-0">
        <p className="text-gray-500 text-xs sm:text-sm font-bold whitespace-nowrap">
          {label}
        </p>
        <p className="text-green-700 font-bold text-xs sm:text-sm whitespace-nowrap">
          {value}
        </p>
      </div>
    );
  }

  // Separate proteins by type
  const { vegProteins, nonVegProteins } = useMemo(() => {
    if (!item?.proteinVariants) return { vegProteins: [], nonVegProteins: [] };

    const veg = item.proteinVariants.filter((p) => p.type === "veg");
    const nonVeg = item.proteinVariants.filter((p) => p.type === "non-veg");

    return { vegProteins: veg, nonVegProteins: nonVeg };
  }, [item?.proteinVariants]);

  // Render protein buttons
  const renderProteinButtons = (
    proteins: ProteinVariant[] | undefined,
    type: "veg" | "non-veg"
  ) => {
    if (!proteins || proteins.length === 0) return null;

    return (
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          {proteins[0]?.imagesrc && (
            <div className="relative w-5 h-5 flex-shrink-0">
              <Image
                src={proteins[0].imagesrc.src}
                alt={proteins[0].name}
                fill
                className="object-contain"
                sizes="24px"
              />
            </div>
          )}
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap my-3">
            {type === "veg" ? "Vegetarian" : "Non-Vegetarian"}
          </p>
        </div>
        <div className="flex flex-row flex-wrap gap-2">
          {proteins.map((protein) => {
            const isSelected = selectedProtein === protein.name;
            return (
              <button
                key={protein.name}
                onClick={() => setSelectedProtein(protein.name)}
                type="button"
                className={`px-3 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  isSelected
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {protein.imagesrc ? (
                  <div className="relative w-5 h-5 flex-shrink-0">
                    <Image
                      src={protein.imagesrc.src}
                      alt={protein.name}
                      fill
                      className="object-contain"
                      sizes="32px"
                    />
                  </div>
                ) : (
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      protein.type === "veg" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                )}
                {protein.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Protein Selection - Only show if proteinVariants exist */}
      {item?.proteinVariants && item.proteinVariants.length > 0 && (
        <div className="mb-4 -mt-1">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Choose Protein:
          </p>
          {/* Two-column layout for Veg and Non-Veg - optimized for horizontal space */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {renderProteinButtons(vegProteins, "veg")}
            {renderProteinButtons(nonVegProteins, "non-veg")}
          </div>
        </div>
      )}

      {/* Price Display */}
      <CardPrice>Rs.{totalPrice}</CardPrice>

      {/* Size Selection - Only show if item has different prices for regular/jumbo */}
      {hasSizeVariants && (
        <div className="flex gap-4 my-3">
          <SizeLabel>
            <input
              type="radio"
              name={`variant-${item?.title}`}
              value="regular"
              checked={variant === "regular"}
              onChange={() => setVariant("regular")}
              className="accent-red-500 w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">Regular</span>
          </SizeLabel>
          <SizeLabel>
            <input
              type="radio"
              name={`variant-${item?.title}`}
              value="jumbo"
              checked={variant === "jumbo"}
              onChange={() => setVariant("jumbo")}
              className="accent-red-500 w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">Jumbo</span>
          </SizeLabel>
        </div>
      )}

      {/* Nutrition Info */}
      {menuType === "restaurant" && currentNutrient ? (
        <CardInfo>
          <NutrientBadge label="Cals" value={`${currentNutrient.cals}`} />
          <NutrientBadge label="Carbs" value={`${currentNutrient.carbs}`} />
          <NutrientBadge label="Fat" value={`${currentNutrient.fat}`} />
          <NutrientBadge label="Protein" value={`${currentNutrient.protein}`} />
        </CardInfo>
      ) : null}
    </div>
  );
};

export default ChooseVariantCard;
