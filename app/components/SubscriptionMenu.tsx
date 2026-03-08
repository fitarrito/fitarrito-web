"use client";
import React, { ReactNode, useState, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import { motion } from "motion/react";

import { Container, ContentWithPaddingXl } from "@/components/misc/Layout";
import LoaderText from "@/components/ImageSkeleton";
import { SectionHeading } from "@/components/misc/Heading";
import SvgDecoratorBlob2 from "@/images/svg-decorator-blob-7.svg";
import Image from "next/image";
import CartModal from "./CartModal";
import tw from "twin.macro";
import Modal from "react-modal";
import CartDrawer from "@/components/CartDrawer";
import DisplayTabContent from "@/components/DisplayTabContent";
import ReactWindowVirtualGrid from "@/components/ReactWindowVirtualGrid";
import { menuItem } from "@/types/types";
import { Card } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { FaUtensils } from "react-icons/fa";
import { FaUserCog } from "react-icons/fa";

type Tabs = {
  [key: string]: menuItem[];
};

interface SubscriptionMenuProps {
  heading: ReactNode;
  tabs: Tabs;
}

interface TabControlProps {
  active: string;
}

const Header = tw(SectionHeading)``;
const DecoratorBlob2 = styled.div`
  ${tw`pointer-events-none -z-20 absolute left-0 bottom-0 h-80 w-80 opacity-15 transform -translate-x-60 text-primary-500`}
`;
const HeaderRow = tw.div`flex justify-between items-center flex-col xl:flex-row`;
const TabsControl = tw.div`flex flex-wrap bg-gray-200 px-2 py-2 rounded leading-none mt-12 xl:mt-0`;
const TabControl = styled.div<TabControlProps>`
  ${tw`cursor-pointer px-6 py-3 mt-2 sm:mt-0 sm:mr-2 last:mr-0 text-gray-600 font-medium rounded-sm transition duration-300 text-sm sm:text-base w-1/2 sm:w-auto text-center`}
  &:hover {
    ${tw`bg-gray-300 text-gray-700`}
  }
  ${(props) =>
    props["active"] === "true" ? tw`bg-primary-500! text-gray-100!` : ""}
`;
const TabContent = tw(motion.div)`max-w-full px-2`;
const VirtualTabContent = tw.div`max-w-full px-2`;
const ContainerWithTopMargin = tw(Container)`pt-8`;
const CardsContainer = tw.div`flex flex-wrap justify-center gap-6 mb-12 mt-4`;

export default function SubscriptionMenu({
  heading,
  tabs,
}: SubscriptionMenuProps) {
  const tabsKeys = useMemo(() => {
    if (tabs && typeof tabs === "object") {
      return Object.keys(tabs);
    }
    return [];
  }, [tabs]);

  const [activeTab, setActiveTab] = useState(tabsKeys[0] || "");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedCard, setSelectedCard] = useState<menuItem | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTabChange = (tabName: string) => {
    setLoading(true);
    setActiveTab(tabName);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const openModal = (card: menuItem) => {
    setSelectedCard(card);
    setQuantity(1);
    setModalOpen(true);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  useEffect(() => {
    if (typeof window !== "undefined") {
      const nextRoot = document.getElementById("__next");
      if (nextRoot) {
        Modal.setAppElement("#__next");
      }
    }
  }, []);

  useEffect(() => {
    if (tabsKeys.length > 0 && !activeTab) {
      setActiveTab(tabsKeys[0]);
    }
  }, [tabsKeys, activeTab]);

  return (
    <ContainerWithTopMargin>
      <ContentWithPaddingXl>
        <CardsContainer>
          <Card
            primaryText="Order your meal today"
            icon={<FaUtensils />}
            onClick={() => router.push("/")}
          />
          <Card
            primaryText="Subscription onboarding form"
            icon={<FaUserCog />}
            onClick={() => router.push("/subscription")}
          />
        </CardsContainer>
        <div className="mt-8 pt-6 border-t border-gray-300">
          <div className="text-lg text-gray-700 mb-6">
            At <strong>Fitarrito</strong>, every meal is designed with balance
            in mind — combining healthy carbohydrates, high-quality proteins,
            fresh fruits, and fiber-rich ingredients.
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Protein Goals */}
              <div>
                <h3 className="text-xl font-bold text-green-700 mb-3">
                  Protein Goals:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-lg text-gray-700 ml-4">
                  <li>
                    <strong>Regular meals:</strong> 20–30 grams of protein
                  </li>
                  <li>
                    <strong>Jumbo meals:</strong> 45–60 grams of protein
                  </li>
                </ul>
              </div>

              {/* Carbohydrate Choices */}
              <div>
                <h3 className="text-xl font-bold text-green-700 mb-3">
                  Carbohydrate Choices (gluten-friendly):
                </h3>
                <ul className="list-disc list-inside space-y-1 text-lg text-gray-700 ml-4">
                  <li>Quinoa</li>
                  <li>Millets</li>
                  <li>Whole wheat chapathi (in wraps)</li>
                  <li>Whole wheat pasta</li>
                  <li>Soba (buckwheat) noodles</li>
                </ul>
              </div>

              {/* Protein Sources */}
              <div>
                <h3 className="text-xl font-bold text-green-700 mb-3">
                  Protein Sources:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-lg text-gray-700 ml-4">
                  <li>Chicken, fish, paneer, tofu, and soya chunks</li>
                  <li>Plant-based proteins like hummus and rajma</li>
                  <li>Additional protein from quinoa and millet</li>
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Fruits & Fiber */}
              <div>
                <h3 className="text-xl font-bold text-green-700 mb-3">
                  Fruits & Fiber:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-lg text-gray-700 ml-4">
                  <li>Fresh fruits are included in all plans</li>
                  <li>
                    Premium packages feature wider fruit varieties for added
                    nutrition and flavor
                  </li>
                </ul>
              </div>

              {/* Dressings */}
              <div>
                <h3 className="text-xl font-bold text-green-700 mb-3">
                  Dressings (low-calorie, fat-free):
                </h3>
                <ul className="list-disc list-inside space-y-1 text-lg text-gray-700 ml-4">
                  <li>Tahini (sesame seed based)</li>
                  <li>Peanut dressing</li>
                  <li>Tomato salsa</li>
                  <li>Hummus (chickpeas)</li>
                  <li>Sour cream (fermented dairy)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-lg text-gray-700 italic mt-6 pt-4 border-t border-gray-200">
            Every element is thoughtfully chosen to fuel your body, support
            dietary needs (including gluten sensitivity), and keep meals both
            wholesome and delicious.
          </div>
        </div>
        <HeaderRow>
          <Header>{heading}</Header>
          {tabsKeys.length > 1 ? (
            <TabsControl>
              {tabs &&
                typeof tabs === "object" &&
                Object.entries(tabs).map(([tabName], index) => (
                  <TabControl
                    key={index}
                    active={activeTab === tabName ? "true" : "false"}
                    onClick={() => handleTabChange(tabName)}
                  >
                    {tabName}
                  </TabControl>
                ))}
            </TabsControl>
          ) : null}
        </HeaderRow>

        <div className="relative flex items-center">
          {loading ? (
            <TabContent ref={scrollRef} className="mx-auto">
              <LoaderText />
            </TabContent>
          ) : (
            <>
              {tabs[activeTab]?.length > 0 ? (
                tabs[activeTab].length > 20 ? (
                  <VirtualTabContent className="mx-auto">
                    <ReactWindowVirtualGrid<menuItem>
                      keyExtractor={(item, idx) => `${item.title}-${idx}`}
                      items={tabs[activeTab] as menuItem[]}
                      renderItem={(card: menuItem, index: number) => (
                        <DisplayTabContent
                          card={card}
                          isDrawerOpen={() => setIsDrawerOpen(true)}
                          openModal={openModal}
                          quantity={quantity}
                          index={index}
                          key={`${card.title}-${index}`}
                        />
                      )}
                      containerHeight={600}
                      itemHeight={400}
                      gap={16}
                      breakpoints={{
                        sm: 1,
                        md: 2,
                        lg: 3,
                        xl: 4,
                      }}
                    />
                  </VirtualTabContent>
                ) : (
                  <TabContent
                    ref={scrollRef}
                    className="mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  >
                    {tabs &&
                      typeof tabs === "object" &&
                      Object.entries(tabs[activeTab]).map(([index, card]) => (
                        <DisplayTabContent
                          card={card}
                          isDrawerOpen={() => setIsDrawerOpen(true)}
                          openModal={openModal}
                          quantity={quantity}
                          index={parseInt(index)}
                          key={`${card.title}-${index}`}
                        />
                      ))}
                  </TabContent>
                )
              ) : (
                <TabContent ref={scrollRef} className="mx-auto">
                  <LoaderText />
                </TabContent>
              )}
            </>
          )}
        </div>
      </ContentWithPaddingXl>

      <DecoratorBlob2>
        <Image src={SvgDecoratorBlob2} alt="Blob-Logo" />
      </DecoratorBlob2>
      <CartModal
        isOpen={isModalOpen}
        closeModal={() => setModalOpen(false)}
        selectedCard={selectedCard}
        quantity={quantity}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
      />
      {isDrawerOpen ? (
        <CartDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
      ) : null}
    </ContainerWithTopMargin>
  );
}
