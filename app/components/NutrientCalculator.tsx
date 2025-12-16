"use client";
import React, { useState } from "react";
import tw from "twin.macro";

interface DataProps {
  data: {
    cals: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  title?: string | undefined;
  content?: string | undefined;
  showAddToBag?: boolean;
}
const Button = tw.button`bg-red-500 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg`;

const NutrientCalculator = (props: DataProps) => {
  const macroNutrients: { label: string; key: keyof DataProps["data"] }[] = [
    { label: "Fat", key: "fat" },
    { label: "Protein", key: "protein" },
    { label: "Carbs", key: "carbs" },
  ];
  const data = props?.data;
  const [selectedProtein] = useState<string | null>(null);

  return (
    <>
      <div className="bg-gray-100 py-6 px-6 rounded-lg shadow-md w-full max-w-full mx-auto text-center flex flex-col lg:flex-row items-center justify-between">
        {/* Title Section */}

        <div className="w-full lg:w-1/3 text-center lg:text-left">
          <h1 className="text-3xl lg:text-5xl font-bold text-gray-900">
            {props?.title || "Nutrition"}
          </h1>
          <p className="text-gray-800 mt-2 font-medium text-sm lg:text-base">
            {props?.content ||
              "Get detailed calorie and macro information based on your selected meal."}
          </p>
        </div>

        {/* Vertical Divider for Large Screens */}
        <div className="hidden lg:block h-36 w-1 bg-gray-300"></div>

        {/* Nutrient Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-6 w-full lg:w-2/3">
          {/* Calories */}
          <div className="bg-yellow-400 text-white p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col items-center w-24 sm:w-36">
            <span className="text-3xl sm:text-4xl font-extrabold">
              {data?.cals || "00"}
            </span>
            <p className="text-sm sm:text-lg font-semibold">Calories</p>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-3 gap-4 sm:gap-12 w-full max-w-xs">
            {macroNutrients.map((item, index) => (
              <div
                key={index}
                className="p-4 sm:p-6 bg-white rounded-2xl shadow-md flex flex-col items-center w-20 sm:w-28"
              >
                <span className="text-xl sm:text-3xl font-bold text-gray-900">
                  {data[item.key] || "00"}g
                </span>
                <p className="text-xs sm:text-md text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>
          {props?.showAddToBag ? (
            <div className="p-6 sm:p-8 ">
              <Button
                disabled={!selectedProtein}
                onClick={() => console.log("Adding:", selectedProtein)}
              >
                Add to Bag
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default NutrientCalculator;
