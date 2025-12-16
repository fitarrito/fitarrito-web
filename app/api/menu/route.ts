// app/api/menu/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";
import menuData from "../../../prisma/data/menu.json";

const prisma = new PrismaClient();

type ProteinVariant = {
  name: string;
  type: "veg" | "non-veg";
  imageUrl: string;
  nutrient: {
    regular: {
      cals: string;
      protein: string;
      fat: string;
      carbs: string;
      price: string;
    };
    jumbo: {
      cals: string;
      protein: string;
      fat: string;
      carbs: string;
      price: string;
    };
  };
};

type MenuJsonItem = {
  title: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
  hasProteinVariants?: boolean;
};

type MenuData = {
  proteinVariants: ProteinVariant[];
  menuItems: MenuJsonItem[];
};

type Nutrient = {
  size: string;
  cals: number;
  protein: number;
  fat: number;
  carbs: number;
  price: number;
};

// Helper function to parse nutrient values back to string format
function formatNutrientValue(value: number): string {
  return `${value}g`;
}

// Get protein variant image URLs from JSON
function getProteinVariantImageUrl(proteinName: string): string | undefined {
  const data = menuData as MenuData;
  const variant = data.proteinVariants?.find(
    (pv) => pv.name === proteinName
  );
  return variant?.imageUrl;
}

type GroupedProteinVariant = ProteinVariant & {
  imagesrc?: { src: string };
  nutrient: {
    regular: {
      cals: string;
      protein: string;
      fat: string;
      carbs: string;
      price: string;
    };
    jumbo: {
      cals: string;
      protein: string;
      fat: string;
      carbs: string;
      price: string;
    };
  };
};

// Helper function to group nutrients by protein variant and size
function groupNutrientsByProtein(nutrients: Nutrient[]): GroupedProteinVariant[] {
  const grouped: { [key: string]: GroupedProteinVariant } = {};
  
  nutrients.forEach((nutrient) => {
    // Parse size like "regular-Chicken" or "jumbo-Paneer"
    const match = nutrient.size.match(/^(regular|jumbo)-(.+)$/);
    if (match) {
      const [, size, proteinName] = match;
      if (!grouped[proteinName]) {
        const imageUrl = getProteinVariantImageUrl(proteinName);
        // Ensure imageUrl starts with / for public folder access
        const normalizedImageUrl = imageUrl 
          ? (imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`)
          : undefined;
        grouped[proteinName] = {
          name: proteinName,
          type: proteinName === "Veggies Only" || 
                proteinName === "Paneer" || 
                proteinName === "Mushroom" || 
                proteinName === "Brocolli" ? "veg" : "non-veg",
          imageUrl: normalizedImageUrl || "",
          imagesrc: normalizedImageUrl ? { src: normalizedImageUrl } : undefined,
          nutrient: {
            regular: {
              cals: "0",
              protein: "0g",
              fat: "0g",
              carbs: "0g",
              price: "0",
            },
            jumbo: {
              cals: "0",
              protein: "0g",
              fat: "0g",
              carbs: "0g",
              price: "0",
            },
          },
        };
      }
      const sizeKey = size as "regular" | "jumbo";
      grouped[proteinName].nutrient[sizeKey] = {
        cals: nutrient.cals.toString(),
        protein: formatNutrientValue(nutrient.protein),
        fat: formatNutrientValue(nutrient.fat),
        carbs: formatNutrientValue(nutrient.carbs),
        price: nutrient.price.toString(),
      };
    }
  });
  
  return Object.values(grouped);
}

export async function GET() {
  console.log("🚀 API Route /api/menu called - Starting data fetch...");
  try {
    // Fetch all menu items with their categories and nutrients
    const menuItems = await prisma.menuItem.findMany({
      include: {
        category: true,
        nutrients: true,
      },
      orderBy: {
        categoryId: "asc",
      },
    });

    console.log("📦 Fetched menu items from database:", menuItems.length);
    
    // Group menu items by category
    const menuByCategory: { [key: string]: Array<{
      title: string;
      description: string;
      price: string;
      rating: string;
      reviews: string;
      url: string;
      imagesrc?: { src: string };
      proteinVariants?: ProteinVariant[];
    }> } = {};

    menuItems.forEach((item) => {
      const categoryName = item.category?.name || "Other";
      
      if (!menuByCategory[categoryName]) {
        menuByCategory[categoryName] = [];
      }

      console.log(`📝 Processing: ${item.title} (Category: ${categoryName})`);
      console.log(`   - Nutrients count: ${item.nutrients.length}`);

      // Group nutrients by protein variant
      const proteinVariants = groupNutrientsByProtein(item.nutrients);

      // Transform Prisma data to match menuItem type
      // Convert imageUrl path to work with Next.js Image component
      // If imageUrl starts with /images/, it should be accessible from public folder
      // Otherwise, we'll use it as-is (assuming it's a valid URL or path)
      const imageSrc = item.imageUrl 
        ? { src: item.imageUrl.startsWith('/') ? item.imageUrl : `/${item.imageUrl}` }
        : undefined;

      const menuItem = {
        title: item.title,
        description: item.description,
        price: item.price.toString(),
        rating: item.rating?.toString() || "0",
        reviews: item.reviews?.toString() || "0",
        url: item.url || "#",
        imagesrc: imageSrc,
        proteinVariants: proteinVariants.length > 0 ? proteinVariants : undefined,
      };

      menuByCategory[categoryName].push(menuItem);
    });

    console.log("✅ Menu data grouped by category:", Object.keys(menuByCategory));
    console.log("📊 Total categories:", Object.keys(menuByCategory).length);

    return NextResponse.json(menuByCategory);
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu data" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
