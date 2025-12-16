"use client";
import tw from "twin.macro";
import React from "react";
import { useAppDispatch, useAppSelector } from "app/lib/hooks";
import Link from "next/link";

import { FaUtensils } from "react-icons/fa";
import { MdOutlineMoreTime, MdCalendarMonth } from "react-icons/md";
import { setMenuType } from "app/lib/features/menuSlice";
const TabContent = tw.div`
  grid grid-cols-3 
  gap-6 max-w-full px-4 text-center justify-center mt-10 
`;

const TabItem = tw.div`
  flex flex-col items-center justify-center gap-2 cursor-pointer
  transition-transform duration-300 hover:scale-105
`;

const IconWrapper = tw.div`
  text-6xl 
`;

const Label = tw.p`
  text-lg font-medium
`;

const Categories = () => {
  // const [selectedMenu, setSelectedMenu] = useState("restaurant");
  const selectedMenu = useAppSelector((state) => state.menu.menuType); // Get from Redux

  const dispatch = useAppDispatch();
  const handleMenuSelection = (menu: string) => {
    dispatch(setMenuType(menu));
  };
  return (
    <TabContent>
      <Link href="/">
        <TabItem onClick={() => handleMenuSelection("restaurant")}>
          <IconWrapper
            className={
              selectedMenu === "restaurant" ? "text-red-600" : "text-gray-600"
            }
          >
            <FaUtensils />
          </IconWrapper>
          <Label
            className={
              selectedMenu === "restaurant" ? "text-red-600" : "text-gray-600"
            }
          >
            Restaurant Menu
          </Label>
        </TabItem>
      </Link>
      <Link href="/subscriptionMenu">
        <TabItem onClick={() => handleMenuSelection("subscription")}>
          <IconWrapper
            className={
              selectedMenu === "subscription" ? "text-red-600" : "text-gray-600"
            }
          >
            <MdCalendarMonth />
          </IconWrapper>
          <Label
            className={
              selectedMenu === "subscription" ? "text-red-600" : "text-gray-600"
            }
          >
            Subscription Menu
          </Label>
        </TabItem>
      </Link>
      <Link href="/preOrderMenu">
        <TabItem onClick={() => handleMenuSelection("preOrder")}>
          <IconWrapper
            className={
              selectedMenu === "preOrder" ? "text-red-600" : "text-gray-600"
            }
          >
            <MdOutlineMoreTime />
          </IconWrapper>
          <Label
            className={
              selectedMenu === "preOrder" ? "text-red-600" : "text-gray-600"
            }
          >
            Nutrient calculator
          </Label>
        </TabItem>
      </Link>
    </TabContent>
  );
};

export default Categories;
