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
  console.log("📍 Environment check:", {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseUrlPreview: process.env.DATABASE_URL ? `${process.env.DATABASE_URL.substring(0, 50)}...` : "NOT SET",
    nodeEnv: process.env.NODE_ENV,
  });
  
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL environment variable is not set");
      return NextResponse.json(
        { 
          error: "Database configuration missing. Please set DATABASE_URL environment variable.",
          details: "This is required for the menu API to work.",
          fix: "Add DATABASE_URL to Vercel environment variables with your Supabase PostgreSQL connection string."
        },
        { status: 500 }
      );
    }

    // Test database connection first
    console.log("🔌 Testing database connection...");
    await prisma.$connect();
    console.log("✅ Database connection successful");

    // Fetch all menu items with their categories and nutrients
    console.log("📊 Fetching menu items from database...");
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
    console.error("❌ Error fetching menu:", error);
    
    // Extract detailed error information
    let errorMessage = "Unknown error";
    let errorCode = "UNKNOWN";
    let errorHint = "Check Vercel logs for more details.";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check for specific Prisma errors
      if (error.message.includes("Can't reach database server") || error.message.includes("P1001")) {
        errorCode = "DATABASE_CONNECTION_ERROR";
        errorHint = "Database server is unreachable. Check DATABASE_URL connection string and ensure the database is accessible.";
      } else if (error.message.includes("does not exist") || error.message.includes("P2025")) {
        errorCode = "TABLE_NOT_FOUND";
        errorHint = "Database tables don't exist. Run 'npx prisma db push' to create tables in Supabase.";
      } else if (error.message.includes("Authentication failed") || error.message.includes("P1000")) {
        errorCode = "AUTHENTICATION_ERROR";
        errorHint = "Database authentication failed. Check DATABASE_URL password and connection string format.";
      } else if (error.message.includes("relation") && error.message.includes("does not exist")) {
        errorCode = "SCHEMA_MISSING";
        errorHint = "Database schema not found. Push schema with 'npx prisma db push' and seed with 'npx prisma db seed'.";
      }
    }
    
    console.error("Error code:", errorCode);
    console.error("Error message:", errorMessage);
    console.error("DATABASE_URL present:", !!process.env.DATABASE_URL);
    console.error("DATABASE_URL preview:", process.env.DATABASE_URL ? `${process.env.DATABASE_URL.substring(0, 30)}...` : "NOT SET");
    
    return NextResponse.json(
      { 
        error: "Failed to fetch menu data",
        code: errorCode,
        message: errorMessage,
        hint: errorHint,
        troubleshooting: {
          step1: "Verify DATABASE_URL is set in Vercel environment variables",
          step2: "Ensure schema is pushed: 'npx prisma db push'",
          step3: "Ensure data is seeded: 'npx prisma db seed'",
          step4: "Check Vercel deployment logs for detailed error"
        }
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
