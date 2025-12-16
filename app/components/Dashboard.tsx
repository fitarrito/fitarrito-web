"use client";
import React, { useEffect } from "react";
import {
  getMenu,
  getPreOrderMenu,
  getSubscriptionMenu,
  setMenuType,
} from "app/lib/features/menuSlice";
import { useAppDispatch, useAppSelector } from "app/lib/hooks";
import About from "@/components/About";
import MenuCategories from "@/components/ChooseMenuType";
import Menu from "@/components/Menu";
import tw from "twin.macro";
import Statistics from "@/components/Statistics";
import { usePathname } from "next/navigation"; // ✅ Import Next.js router

const HighlightedText = tw.span`bg-primary-500 text-gray-100 px-4 transform -skew-x-12 inline-block`;
// const tabs = {
//   Main: Main,
//   Salad: Salad,
//   Nachos: Nachos,
//   Taco: Taco,
//   Smoothie: Smoothie,
// };
export default function Dashboard() {
  const menu = useAppSelector((state) => state.menu.restaurantMenu);

  const menuType = useAppSelector((state) => state.menu.menuType);
  const pathname = usePathname(); // ✅ Get current route
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getMenu());
    dispatch(getPreOrderMenu());
    dispatch(getSubscriptionMenu());
  }, [dispatch, menuType]);
  useEffect(() => {
    if (pathname === "/") {
      dispatch(setMenuType("restaurant"));
    }
  }, [pathname, dispatch]);
  return (
    <>
      <About />
      <MenuCategories />
      <Menu
        tabs={menu}
        heading={
          <>
            Checkout our <HighlightedText>menu.</HighlightedText>
          </>
        }
      />
      <Statistics />
    </>
  );
}
