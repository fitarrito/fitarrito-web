"use client";

import React, { useEffect } from "react";
import { getMenu, getPreOrderMenu } from "app/lib/features/menuSlice";
import { useAppDispatch, useAppSelector } from "app/lib/hooks";
import Menu from "@/components/Menu";
import tw from "twin.macro";
const HighlightedText = tw.span`bg-primary-500 text-gray-100 px-4 transform -skew-x-12 inline-block`;
// const tabs = {
//   Main: Main,
//   Salad: Salad,
//   Nachos: Nachos,
//   Taco: Taco,
//   Smoothie: Smoothie,
// };
export default function Dashboard() {
  const menu = useAppSelector((state) => state.menu.menu);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getMenu());
    dispatch(getPreOrderMenu());
  }, [dispatch]);

  return (
    <>
      <Menu
        tabs={menu}
        heading={
          <>
            Checkout our <HighlightedText>menu.</HighlightedText>
          </>
        }
      />
    </>
  );
}
