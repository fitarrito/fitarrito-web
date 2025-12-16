import ChickenBurrito from "@/images/menuimages/ChickenBurrito.svg";

import BrocolliIcon from "@/images/menuimages/proteinImages/Brocolli.svg";
import ChickenIcon from "@/images/menuimages/proteinImages/ChickenIcon.svg";
import MushroomIcon from "@/images/menuimages/proteinImages/MushroomIcon.svg";
import PaneerIcon from "@/images/menuimages/proteinImages/PaneerIcon.svg";
import FishIcon from "@/images/menuimages/proteinImages/FishIcon.svg";
import MeatIcon from "@/images/menuimages/proteinImages/MeatIcon.svg";
import Fiesta from "@/images/menuimages/fiesta.svg";
import VeggiesIcon from "@/images/menuimages/proteinImages/VeggiesIcon.svg";
import Chickentaco from "@/images/menuimages/ChickenTaco.svg";

import VegOuesadilla from "@/images/menuimages/VegQuesadilla.svg";

import BBQChickenSalad from "@/images/menuimages/BBQChickenSalad.svg";
import TeriyakiPaneerSalad from "@/images/menuimages/PaneerTeriyakiSalad.svg";

import { dbMenuItem as Item, ProteinVariant } from "@/types/types";

export const proteinVariants: ProteinVariant[] = [
  {
    name: "Veggies Only",
    type: "veg" as const,
    imagesrc: VeggiesIcon,
    nutrient: {
      regular: {
        cals: "300.0",
        protein: "10.0g",
        fat: "8.0g",
        carbs: "45.0g",
        price: "20",
      },
      jumbo: {
        cals: "400.0",
        protein: "15.0g",
        fat: "12.0g",
        carbs: "60.0g",
        price: "40",
      },
    },
  },
  {
    name: "Chicken",
    type: "non-veg" as const,
    imagesrc: ChickenIcon,
    nutrient: {
      regular: {
        cals: "562.5",
        protein: "37.5g",
        fat: "22.5g",
        carbs: "45.0g",
        price: "40",
      },
      jumbo: {
        cals: "750",
        protein: "50g",
        fat: "30g",
        carbs: "60g",
        price: "100",
      },
    },
  },
  {
    name: "Paneer",
    type: "veg" as const,
    imagesrc: PaneerIcon,
    nutrient: {
      regular: {
        cals: "465.0",
        protein: "22.5g",
        fat: "21.0g",
        carbs: "48.0g",
        price: "30",
      },
      jumbo: {
        cals: "620",
        protein: "30g",
        fat: "28g",
        carbs: "65g",
        price: "80",
      },
    },
  },
  {
    name: "Mushroom",
    type: "veg" as const,
    imagesrc: MushroomIcon,
    nutrient: {
      regular: {
        cals: "465.0",
        protein: "22.5g",
        fat: "21.0g",
        carbs: "48.0g",
        price: "20",
      },
      jumbo: {
        cals: "620",
        protein: "30g",
        fat: "28g",
        carbs: "65g",
        price: "60",
      },
    },
  },
  {
    name: "Brocolli",
    type: "veg" as const,
    imagesrc: BrocolliIcon,
    nutrient: {
      regular: {
        cals: "465.0",
        protein: "22.5g",
        fat: "21.0g",
        carbs: "48.0g",
        price: "40",
      },
      jumbo: {
        cals: "620",
        protein: "30g",
        fat: "28g",
        carbs: "65g",
        price: "100",
      },
    },
  },
  {
    name: "Mutton",
    type: "non-veg" as const,
    imagesrc: MeatIcon,
    nutrient: {
      regular: {
        cals: "562.5",
        protein: "33.0g",
        fat: "25.5g",
        carbs: "45.0g",
        price: "100",
      },
      jumbo: {
        cals: "750",
        protein: "45g",
        fat: "35g",
        carbs: "60g",
        price: "180",
      },
    },
  },
  {
    name: "Fish",
    type: "non-veg" as const,
    imagesrc: FishIcon,
    nutrient: {
      regular: {
        cals: "562.5",
        protein: "37.5g",
        fat: "22.5g",
        carbs: "45.0g",
        price: "60",
      },
      jumbo: {
        cals: "750",
        protein: "50g",
        fat: "30g",
        carbs: "60g",
        price: "120",
      },
    },
  },
];

export const Burrito: Array<Item> = [
  {
    imagesrc: ChickenBurrito,
    title: "Burrito",
    description: "Tortilla roll infused with selected Protein and veggies",
    price: "80",
    rating: "5.0",
    reviews: "87",
    url: "#",
    // Default nutrient (for backward compatibility)
    nutrient: {
      regular: {
        cals: "562.5",
        protein: "37.5g",
        fat: "22.5g",
        carbs: "45.0g",
        price: "120",
      },
      jumbo: {
        cals: "750",
        protein: "50g",
        fat: "30g",
        carbs: "60g",
        price: "120",
      },
    },
    // Protein variants with different nutrients and prices
    proteinVariants: proteinVariants,
  },
];
export const Bowl: Array<Item> = [
  {
    imagesrc: BBQChickenSalad,
    title: "Chicken Burrito Bowl",
    description: "Tortilla roll infused with chicken and veggies",
    price: "120",
    rating: "5.0",
    reviews: "87",
    url: "#",
    nutrient: {
      regular: {
        cals: "562.5",
        protein: "37.5g",
        fat: "22.5g",
        carbs: "45.0g",
        price: "120",
      },
      jumbo: {
        cals: "750 ",
        protein: "50g",
        fat: "30g",
        carbs: "60g",
        price: "180",
      },
    },
    proteinVariants: proteinVariants,
  },
  // {
  //   imagesrc: MuttonBurrito,
  //   title: "Mutton Burrito Bowl",
  //   description:
  //     "A hearty tortilla roll filled with slow-cooked spiced mutton, fresh veggies, beans, and flavorful sauces.",
  //   price: "330",
  //   rating: "4.8",
  //   reviews: "32",
  //   url: "#",
  //   nutrient: {
  //     regular: {
  //       cals: "562.5",
  //       protein: "33.0g",
  //       fat: "25.5g",
  //       carbs: "45.0g",
  //       price: "120",
  //     },
  //     jumbo: {
  //       cals: "750 ",
  //       protein: "45g",
  //       fat: "35g",
  //       carbs: "60g",
  //       price: "180",
  //     },
  //   },
  // },
  // {
  //   imagesrc: PannerBurrito,
  //   title: "Paneer Burrito Bowl",
  //   description:
  //     "A soft tortilla filled with spiced paneer, sautéed bell peppers, onions, beans, and a tangy yogurt sauce.",
  //   price: "179",
  //   rating: "4.9",
  //   reviews: "89",
  //   url: "#",
  //   nutrient: {
  //     regular: {
  //       cals: "465.0",
  //       protein: "22.5g",
  //       fat: "21.0g",
  //       carbs: "48.0g",
  //       price: "120",
  //     },
  //     jumbo: {
  //       cals: "620 ",
  //       protein: "30g",
  //       fat: "28g",
  //       carbs: "65g",
  //       price: "180",
  //     },
  //   },
  // },
  // {
  //   imagesrc: MushroomBurrito,
  //   title: "Mushroom Burrito Bowl",
  //   description:
  //     "A delicious mix of sautéed mushrooms, beans, rice, fresh veggies, and creamy avocado wrapped in a tortilla.",
  //   price: "179",
  //   rating: "4.6",
  //   reviews: "12",
  //   url: "#",
  //   nutrient: {
  //     regular: {
  //       cals: "375.0",
  //       protein: "15.0g",
  //       fat: "10.5g",
  //       carbs: "52.5g",
  //       price: "120",
  //     },
  //     jumbo: {
  //       cals: "500 ",
  //       protein: "20g",
  //       fat: "15g",
  //       carbs: "70g",
  //       price: "180",
  //     },
  //   },
  // },
  // {
  //   imagesrc: ChickenBurrito,
  //   title: "Egg Burrito Bowl",
  //   description:
  //     "A protein-rich burrito stuffed with scrambled eggs, beans, cheese, and fresh vegetables.",
  //   price: "159",
  //   rating: "5.0",
  //   reviews: "61",
  //   url: "#",
  //   nutrient: {
  //     regular: {
  //       cals: "390.0",
  //       protein: "25.5g",
  //       fat: "16.5g",
  //       carbs: "37.5g",
  //       price: "120",
  //     },
  //     jumbo: {
  //       cals: "520 ",
  //       protein: "35g",
  //       fat: "22g",
  //       carbs: "50g",
  //       price: "180",
  //     },
  //   },
  // },
  // {
  //   imagesrc: VegHummusBuddhaBowl,
  //   title: "Hummus Buddha Bowl (Veg)",
  //   description:
  //     "A nutritious bowl with hummus, quinoa, fresh greens, roasted chickpeas, and tahini dressing.",
  //   price: "190",
  //   rating: "4.2",
  //   reviews: "95",
  //   url: "#",
  //   nutrient: {
  //     regular: {
  //       cals: "360.0",
  //       protein: "16.5g",
  //       fat: "13.5g",
  //       carbs: "40.5g",
  //       price: "120",
  //     },
  //     jumbo: {
  //       cals: "480",
  //       protein: "22g",
  //       fat: "18g",
  //       carbs: "55g",
  //       price: "180",
  //     },
  //   },
  // },
  // {
  //   imagesrc: ChickenHummusBuddhaBowl,
  //   title: "Chicken Hummus Buddha Bowl",
  //   description:
  //     "A high-protein bowl with grilled chicken, hummus, quinoa, roasted veggies, and garlic tahini dressing.",
  //   price: "240",
  //   rating: "4.2",
  //   reviews: "95",
  //   url: "#",
  //   nutrient: {
  //     regular: {
  //       cals: "450.0",
  //       protein: "37.5g",
  //       fat: "15.0g",
  //       carbs: "45.0g",
  //       price: "120",
  //     },
  //     jumbo: {
  //       cals: "600",
  //       protein: "50g",
  //       fat: "20g",
  //       carbs: "60g",
  //       price: "180",
  //     },
  //   },
  // },

  // {
  //   imagesrc: VegLaksa,
  //   title: "Veg Laksa",
  //   description: "A spicy coconut-based noodle soup with tofu and vegetables.",
  //   price: "180",
  //   rating: "4.2",
  //   reviews: "95",
  //   url: "#",
  //   nutrient: {
  //     regular: {
  //       cals: "375.0",
  //       protein: "12.0g",
  //       fat: "18.0g",
  //       carbs: "60.0g",
  //       price: "120",
  //     },
  //     jumbo: {
  //       cals: "500 ",
  //       protein: "16g",
  //       fat: "24g",
  //       carbs: "80g",
  //       price: "180",
  //     },
  //   },
  // },
  // {
  //   imagesrc: PaneerLaksa,
  //   title: "Paneer Laksa",
  //   description: "A rich and creamy laksa with paneer and coconut milk.",
  //   price: "200",
  //   rating: "4.2",
  //   reviews: "95",
  //   url: "#",
  //   nutrient: {
  //     regular: {
  //       cals: "420.0",
  //       protein: "18.0g",
  //       fat: "22.5g",
  //       carbs: "52.5g",
  //       price: "120",
  //     },
  //     jumbo: {
  //       cals: "560 ",
  //       protein: "24g",
  //       fat: "30g",
  //       carbs: "70g",
  //       price: "180",
  //     },
  //   },
  // },
  // {
  //   imagesrc: SingaporeLaksa,
  //   title: "Chicken Laksa",
  //   description: "A fragrant laksa with tender chicken and rice noodles.",
  //   price: "235",
  //   rating: "4.2",
  //   reviews: "95",
  //   url: "#",
  //   nutrient: {
  //     regular: {
  //       cals: "450.0",
  //       protein: "27.0g",
  //       fat: "15.0g",
  //       carbs: "60.0g",
  //       price: "120",
  //     },
  //     jumbo: {
  //       cals: "600 ",
  //       protein: "36g",
  //       fat: "20g",
  //       carbs: "80g",
  //       price: "180",
  //     },
  //   },
  // },
];
export const Salad: Array<Item> = [
  {
    imagesrc: TeriyakiPaneerSalad,
    title: "Salad",
    description: "Tomato Salad & Carrot",
    price: "180",
    rating: "5.0",
    reviews: "87",
    url: "#",
    nutrient: {
      regular: {
        cals: "300.0",
        protein: "15.0g",
        fat: "7.5g",
        carbs: "30.0g",
        price: "120",
      },
      jumbo: {
        cals: "400",
        protein: "20g",
        fat: "10g",
        carbs: "40g",
        price: "180",
      },
    },
    proteinVariants: proteinVariants,
  },
  // {
  //   imagesrc: MushroomSalad,
  //   title: "Mushroom Salad",
  //   description: "Hamburger & Fries",
  //   price: "180",
  //   rating: "4.9",
  //   reviews: "89",
  //   url: "#",
  // },
  // {
  //   imagesrc: BBQChickenSalad,
  //   title: "Barbeque chicken Salad",
  //   description: "Crispy Soyabeans",
  //   price: "180",
  //   rating: "4.6",
  //   reviews: "12",
  //   url: "#",
  // },
  // {
  //   imagesrc: TeriyakiChickenSalad,
  //   title: "Chicken Teriyaki Salad",
  //   description: "Crispy Soyabeans",
  //   price: "180",
  //   rating: "4.6",
  //   reviews: "12",
  //   url: "#",
  // },
];
export const Nachos: Array<Item> = [
  {
    imagesrc: Fiesta,
    title: "Nachos Fiesta",
    description: "Tomato Salad & Carrot",
    price: "180",
    rating: "5.0",
    reviews: "87",
    url: "#",
    proteinVariants: proteinVariants,
  },
];
export const Taco: Array<Item> = [
  {
    imagesrc: Chickentaco,
    title: "Taco",
    description: "Tomato Salad & Carrot",
    price: "80",
    rating: "5.0",
    reviews: "87",
    url: "#",
    // Base nutrient structure for items without size variants
    nutrient: {
      regular: {
        cals: "300.0",
        protein: "15.0g",
        fat: "7.5g",
        carbs: "30.0g",
        price: "80",
      },
      jumbo: {
        cals: "300.0",
        protein: "15.0g",
        fat: "7.5g",
        carbs: "30.0g",
        price: "80",
      },
    },
    proteinVariants: proteinVariants,
  },
  // {
  //   imagesrc: Muttontaco,
  //   title: "Mutton Taco",
  //   description: "Cheese Pizza",
  //   price: "120",
  //   rating: "4.8",
  //   reviews: "32",
  //   url: "#",
  // },
  // {
  //   imagesrc: EggTaco,
  //   title: "Egg Taco",
  //   description: "Hamburger & Fries",
  //   price: "70",
  //   rating: "4.9",
  //   reviews: "89",
  //   url: "#",
  // },
  // {
  //   imagesrc: Paneertaco,
  //   title: "Paneer Taco",
  //   description: "Crispy Soyabeans",
  //   price: "70",
  //   rating: "4.6",
  //   reviews: "12",
  //   url: "#",
  // },
  // {
  //   imagesrc: MushroomTaco,
  //   title: "Mushroom Taco",
  //   description: "Roasted Chicken & Egg",
  //   price: "70",
  //   rating: "4.2",
  //   reviews: "19",
  //   url: "#",
  // },
];
export const Quesadillas: Array<Item> = [
  {
    imagesrc: VegOuesadilla,
    title: "Veg Quesadillas",
    description: "A crispy tortilla filled with cheese, beans, and vegetables.",
    price: "160",
    rating: "4.2",
    reviews: "95",
    url: "#",
    nutrient: {
      regular: {
        cals: "480.0",
        protein: "15.0g",
        fat: "18.0g",
        carbs: "67.5g",
        price: "120",
      },
      jumbo: {
        cals: "640 ",
        protein: "20g",
        fat: "24g",
        carbs: "90g",
        price: "180",
      },
    },
    proteinVariants: proteinVariants,
  },
];
// export const Smoothie: Array<Item> = [
//   {
//     imagesrc: AppleSmoothie,
//     title: "Apple Smoothie",
//     description: "Tomato Salad & Carrot",
//     price: "99",
//     rating: "5.0",
//     reviews: "87",
//     url: "#",
//   },
//   {
//     imagesrc: BananaSmoothie,
//     title: "Banana Smoothie",
//     description: "Cheese Pizza",
//     price: "99",
//     rating: "4.8",
//     reviews: "32",
//     url: "#",
//   },
//   {
//     imagesrc: MangoSmoothie,
//     title: "Mango Smoothie",
//     description: "Hamburger & Fries",
//     price: "99",
//     rating: "4.9",
//     reviews: "89",
//     url: "#",
//   },
//   {
//     imagesrc: ChocolateSmoothie,
//     title: "Chocolate smoothie",
//     description: "Crispy Soyabeans",
//     price: "99",
//     rating: "4.6",
//     reviews: "12",
//     url: "#",
//   },
// ];
