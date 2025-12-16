"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "app/lib/store";
import Image from "next/image";
import { Header, HeaderRow } from "@/components/misc/Header";
import { useAppSelector, useAppDispatch } from "app/lib/hooks";
import { setSelectedMenu } from "app/lib/features/menuSlice";
import { addOnsItem } from "@/types/types";

import NutrientCalculator from "@/components/NutrientCalculator";
// import MenuCategories from "@/components/ChooseMenuType";
import tw from "twin.macro";
import styled from "styled-components";

interface dataProps {
  cals: number;
  protein: number;
  fat: number;
  carbs: number;
}
interface TabControlProps {
  active: string; // Adjust the type as needed
}

interface dataProps {
  cals: number;
  protein: number;
  fat: number;
  carbs: number;
}
const Section = tw.div`bg-white p-4 rounded-lg shadow-md my-4`;
const Title = tw.h2`text-lg font-bold text-yellow-800 mb-2 uppercase`;
const IngredientItem = tw.label`flex items-center justify-between py-3 border-b`;
const Input = tw.input`w-5 h-5 accent-red-500`;
const NutrientInfo = tw.div`text-right text-gray-600 text-sm`;
const ImageWrapper = tw.div`w-12 h-12 rounded-full overflow-hidden shadow-lg bg-gray-200`;
const TabControl = styled.div<TabControlProps>`
  ${tw`cursor-pointer px-6 py-3 mt-2 sm:mt-0 sm:mr-2 last:mr-0 text-gray-600 font-medium rounded-sm transition duration-300 text-sm sm:text-base w-1/2 sm:w-auto text-center`}
  &:hover {
    ${tw`bg-gray-300 text-gray-700`}
  }
  ${(props) =>
    props["active"] === "true" ? tw`bg-primary-500! text-gray-100!` : ""}
`;

const TabsControl = tw.div`flex flex-wrap bg-gray-200 px-2 py-2 rounded leading-none mt-12 xl:mt-0`;
const HighlightedText = tw.span`bg-primary-500 text-gray-100 px-4 transform -skew-x-12 inline-block`;

const Container = tw.div`relative mt-16`;

export default function PreOrdermenu() {
  const menu = useAppSelector((state) => state.menu.preOrderMenu);
  const tabsKeys = menu && typeof menu === "object" ? Object.keys(menu) : [];
  const [activeTab, setActiveTab] = useState(tabsKeys[0] || "");
  const [nutrientData, setNutrientData] = useState<dataProps>({
    cals: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  });
  useEffect(() => {
    if (tabsKeys.length > 0) {
      const defaultTab = tabsKeys[0];
      const defaultMenu = menu?.[defaultTab];
      if (defaultMenu && defaultMenu.length > 0) {
        dispatch(setSelectedMenu(defaultMenu[0]));
      }
    }
  }, [menu]);
  const AddOnImage = React.memo(
    ({ src, alt }: { src: string; alt: string }) => (
      <ImageWrapper>
        <Image
          src={src}
          alt={alt}
          width={48}
          height={48}
          className="object-cover"
        />
      </ImageWrapper>
    )
  );
  AddOnImage.displayName = "AddOnImage";

  const ChooseAddOns = React.memo(({ data }: { data: addOnsItem[] }) => {
    return data?.map((category, index) => (
      <Section key={index}>
        <Title>{category?.type}</Title>
        {category?.value?.map((protein) => (
          <IngredientItem key={protein.item}>
            <div className="flex items-center space-x-3">
              <Input
                type="checkbox"
                name="addOns"
                checked={selectedAddOnsMemo.some(
                  (selected) => selected.item === protein.item
                )}
                onChange={() =>
                  handleSelection({
                    item: protein.item,
                    nutrient: protein.nutrient,
                  })
                }
              />
              <AddOnImage src={protein.imagesrc.src} alt={protein.item} />

              <p className=" text-gray-700 text-lg font-semibold">
                {protein.item}
              </p>
            </div>
            <NutrientInfo>
              <span className="font-bold text-2xl">
                {protein.nutrient?.jumbo?.cals ?? 0} cal
              </span>{" "}
              <br />
              <span className="text-red-600 font-semibold text-lg px-4">
                {protein.nutrient?.jumbo?.fat ?? 0}g Fat
              </span>
              <span className="w-px h-6 bg-gray-300 inline-block mx-2"></span>
              <span className="text-green-600 font-semibold text-lg px-4">
                {protein.nutrient?.jumbo?.protein ?? 0}g Protein
              </span>
              <span className="w-px h-6 bg-gray-300 inline-block mx-2"></span>
              <span className="text-yellow-600 font-semibold text-lg">
                {protein.nutrient?.jumbo?.carbs ?? 0}g Carbs
              </span>
            </NutrientInfo>
          </IngredientItem>
        ))}
      </Section>
    ));
  });
  ChooseAddOns.displayName = "ChooseAddOns";

  const [selectedAddOns, setSelectedAddOns] = useState<
    {
      item: string;
      nutrient?: { cals: string; fat: string; protein: string; carbs: string };
    }[]
  >([]);
  const selectedAddOnsMemo = React.useMemo(
    () => selectedAddOns,
    [selectedAddOns]
  );
  const handleSelection = (proteinItem: {
    item: string;
    nutrient?: {
      regular: { cals: string; fat: string; protein: string; carbs: string };

      jumbo: { cals: string; fat: string; protein: string; carbs: string };
    };
  }) => {
    setSelectedAddOns((prev) => {
      const index = prev.findIndex((item) => item.item === proteinItem.item);

      if (index !== -1) {
        return prev.filter((item) => item.item !== proteinItem.item);
      }

      return [
        ...prev,
        {
          item: proteinItem.item,
          nutrient: proteinItem.nutrient?.jumbo, // Ensure nutrient data is stored
        },
      ];
    });
  };
  useEffect(() => {
    const updatedNutrients = { cals: 0, fat: 0, protein: 0, carbs: 0 };

    selectedAddOns.forEach((addOn) => {
      updatedNutrients.cals += Number(addOn.nutrient?.cals ?? 0);
      updatedNutrients.fat += Number(addOn.nutrient?.fat ?? 0);
      updatedNutrients.protein += Number(addOn.nutrient?.protein ?? 0);
      updatedNutrients.carbs += Number(addOn.nutrient?.carbs ?? 0);
    });
    setNutrientData(updatedNutrients);
  }, [selectedAddOns]);

  const selectedMenu = useSelector(
    (state: RootState) => state.menu.selectedMenu
  );
  const addOns = selectedMenu?.addOns;
  const dispatch = useAppDispatch();

  const specificAddons = selectedMenu?.specificAddons;
  const handleTabChange = (tabName: string) => {
    const newMenuItems = menu?.[tabName];
    if (Array.isArray(newMenuItems) && newMenuItems.length > 0) {
      dispatch(setSelectedMenu(newMenuItems[0])); // Set first item of the new tab
    }
    setActiveTab(tabName);
  };
  return (
    <Container>
      {/* <MenuCategories /> */}
      <HeaderRow>
        <Header>
          Select Your <HighlightedText>meal.</HighlightedText>
        </Header>
        <TabsControl>
          {menu &&
            typeof menu === "object" &&
            Object.entries(menu).map(([tabName], index) => (
              <TabControl
                key={index}
                active={activeTab === tabName ? "true" : "false"}
                onClick={() => handleTabChange(tabName)}
              >
                {tabName}
              </TabControl>
            ))}
        </TabsControl>
      </HeaderRow>
      <NutrientCalculator data={nutrientData} showAddToBag={false} />
      <ChooseAddOns
        data={Array.isArray(specificAddons) ? specificAddons : []}
      />
      <ChooseAddOns data={Array.isArray(addOns) ? addOns : []} />
    </Container>
  );
}
