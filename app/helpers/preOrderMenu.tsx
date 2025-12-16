import Chicken from "@/images/menuimages/proteinImages/ChickenIcon.svg";
import MuttonIcon from "@/images/menuimages/proteinImages/MeatIcon.svg";
import WhiteRice from "@/images/menuimages/WhiteRice.svg";
import BrownRice from "@/images/menuimages/BrownRice.svg";
import BlackBeans from "@/images/menuimages/BlackBeans.svg";
import PintoBeans from "@/images/menuimages/PintoBeans.svg";
import circle from "@/images/menuimages/white-circle.svg";
import Tortilla from "@/images/menuimages/Tortilla.svg";
import FishIcon from "@/images/menuimages/proteinImages/FishIcon.svg";
import { NutrientCalItem, addOnsItem } from "app/types/types";

const commonAddOns: Array<addOnsItem> = [
  {
    type: "Protein",
    value: [
      {
        item: "Chicken",
        imagesrc: Chicken,

        nutrient: {
          regular: {
            cals: "562.5",
            protein: "37.5",
            fat: "22.5",
            carbs: "45.0",
          },
          jumbo: {
            cals: "230 ",
            protein: "27",
            fat: "14",
            carbs: "0",
          },
        },
      },
      {
        item: "Mutton",
        imagesrc: MuttonIcon,

        nutrient: {
          regular: {
            cals: "562.5",
            protein: "37.5",
            fat: "22.5",
            carbs: "45.0",
          },
          jumbo: {
            cals: "294 ",
            protein: "25",
            fat: "21",
            carbs: "0",
          },
        },
      },
      {
        item: "Fish",
        imagesrc: FishIcon,

        nutrient: {
          regular: {
            cals: "206",
            protein: "22",
            fat: "12",
            carbs: "0",
          },
          jumbo: {
            cals: "206",
            protein: "22",
            fat: "12",
            carbs: "0",
          },
        },
      },
    ],
  },

  {
    type: "Beans",
    value: [
      {
        item: "Black Beans",
        imagesrc: BlackBeans,

        nutrient: {
          regular: {
            cals: "562.5",
            protein: "37.5",
            fat: "22.5",
            carbs: "45.0",
          },
          jumbo: {
            cals: "67 ",
            protein: "3.2",
            fat: "0.4",
            carbs: "8",
          },
        },
      },
      {
        item: "Pinto Beans",
        imagesrc: PintoBeans,

        nutrient: {
          regular: {
            cals: "562.5",
            protein: "37.5",
            fat: "22.5",
            carbs: "45.0",
          },
          jumbo: {
            cals: "108",
            protein: "6",
            fat: "0.5",
            carbs: "19",
          },
        },
      },
      {
        item: "No Beans",
        imagesrc: circle,

        nutrient: {
          regular: {
            cals: "562.5",
            protein: "37.5",
            fat: "22.5",
            carbs: "45.0",
          },
          jumbo: {
            cals: "0 ",
            protein: "0",
            fat: "0",
            carbs: "0",
          },
        },
      },
    ],
  },
  {
    type: "Veggies",
    value: [
      {
        item: "Corn Salsa",
        imagesrc: circle,

        nutrient: {
          regular: {
            cals: "562.5",
            protein: "37.5",
            fat: "22.5",
            carbs: "45.0",
          },
          jumbo: {
            cals: "80",
            protein: "3",
            fat: "2",
            carbs: "16",
          },
        },
      },
      {
        item: "Pico De Gallo (Tomato Salad)",
        imagesrc: circle,

        nutrient: {
          regular: {
            cals: "562.5",
            protein: "37.5",
            fat: "22.5",
            carbs: "45.0",
          },
          jumbo: {
            cals: "25",
            protein: "0",
            fat: "0",
            carbs: "4",
          },
        },
      },
      {
        item: "Roasted Tomato Salsa",
        imagesrc: circle,

        nutrient: {
          regular: {
            cals: "562.5",
            protein: "37.5",
            fat: "22.5",
            carbs: "45.0",
          },
          jumbo: {
            cals: "30",
            protein: "0",
            fat: "0",
            carbs: "4",
          },
        },
      },
      {
        item: "Sour Cream",
        imagesrc: circle,

        nutrient: {
          regular: {
            cals: "562.5",
            protein: "37.5",
            fat: "22.5",
            carbs: "45.0",
          },
          jumbo: {
            cals: "67",
            protein: "5",
            fat: "1",
            carbs: "2",
          },
        },
      },
      {
        item: "Fajita Veggies",
        imagesrc: circle,

        nutrient: {
          regular: {
            cals: "562.5",
            protein: "37.5",
            fat: "22.5",
            carbs: "45.0",
          },
          jumbo: {
            cals: "20",
            protein: "1",
            fat: "0",
            carbs: "5",
          },
        },
      },
      {
        item: "Cheese",
        imagesrc: circle,

        nutrient: {
          regular: {
            cals: "562.5",
            protein: "37.5",
            fat: "22.5",
            carbs: "45.0",
          },
          jumbo: {
            cals: "58",
            protein: "4",
            fat: "5",
            carbs: "0",
          },
        },
      },
      {
        item: "Lettuce",
        imagesrc: circle,

        nutrient: {
          regular: {
            cals: "562.5",
            protein: "37.5",
            fat: "22.5",
            carbs: "45.0",
          },
          jumbo: {
            cals: "5",
            protein: "0",
            fat: "0",
            carbs: "1",
          },
        },
      },
    ],
  },
];
const bowlAddOns: Array<addOnsItem> = [
  {
    type: "Rice",
    value: [
      {
        item: "White Rice",
        imagesrc: WhiteRice,

        nutrient: {
          regular: {
            cals: "562.5",
            protein: "37.5",
            fat: "22.5",
            carbs: "45.0",
          },
          jumbo: {
            cals: "130",
            protein: "2.5",
            fat: "1",
            carbs: "28",
          },
        },
      },
      {
        item: "Brown Rice",
        imagesrc: BrownRice,

        nutrient: {
          regular: {
            cals: "562.5",
            protein: "37.5",
            fat: "22.5",
            carbs: "45.0",
          },
          jumbo: {
            cals: "110",
            protein: "2.5",
            fat: "1",
            carbs: "22",
          },
        },
      },
      {
        item: "No Rice",
        imagesrc: circle,

        nutrient: {
          regular: {
            cals: "0",
            protein: "37.5",
            fat: "22.5",
            carbs: "45.0",
          },
          jumbo: {
            cals: "0 ",
            protein: "0",
            fat: "0",
            carbs: "0",
          },
        },
      },
    ],
  },
];
const burritoAddOns: Array<addOnsItem> = [
  {
    type: "Included Ingredient",
    value: [
      {
        item: "Tortilla",
        imagesrc: Tortilla,

        nutrient: {
          jumbo: {
            cals: "320",
            protein: "9.5",
            fat: "9",
            carbs: "50",
          },
          regular: {
            cals: "160",
            protein: "4.75",
            fat: "4.5",
            carbs: "25",
          },
        },
      },
    ],
  },
];
export const Burrito: Array<NutrientCalItem> = [
  {
    tabName: "Burritos",
    addOns: commonAddOns,
    specificAddons: burritoAddOns,
  },
];
export const Bowl: Array<NutrientCalItem> = [
  {
    tabName: "Bowls",

    addOns: commonAddOns,
    specificAddons: bowlAddOns,
  },
];
export const Salad: Array<NutrientCalItem> = [
  {
    tabName: "Salads",

    addOns: commonAddOns,
  },
];
