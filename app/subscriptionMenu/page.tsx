"use client";

import React, { useEffect } from "react";
import { getSubscriptionMenu, setMenuType } from "app/lib/features/menuSlice";
import { useAppDispatch, useAppSelector } from "app/lib/hooks";
import SubscriptionMenu from "@/components/SubscriptionMenu";
import MenuCategories from "@/components/ChooseMenuType";
import { Container, ContentWithPaddingXl } from "@/components/misc/Layout";
import tw from "twin.macro";
import { usePathname } from "next/navigation";

const HighlightedText = tw.span`bg-primary-500 text-gray-100 px-4 transform -skew-x-12 inline-block`;

export default function SubscriptionMenuPage() {
  const subscriptionMenu = useAppSelector(
    (state) => state.menu.subscriptionMenu
  );
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  useEffect(() => {
    dispatch(getSubscriptionMenu());
  }, [dispatch]);

  useEffect(() => {
    if (pathname === "/subscriptionMenu") {
      dispatch(setMenuType("subscription"));
    }
  }, [pathname, dispatch]);

  return (
    <>
      <Container>
        <ContentWithPaddingXl>
          <MenuCategories />
        </ContentWithPaddingXl>
      </Container>
      <SubscriptionMenu
        tabs={subscriptionMenu}
        heading={
          <>
            Checkout our <HighlightedText>subscription menu.</HighlightedText>
          </>
        }
      />
    </>
  );
}
