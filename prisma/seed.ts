import { PrismaClient } from "../generated/prisma";
import menuData from "./data/menu.json" assert { type: "json" };

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

// Helper function to parse nutrient values (remove 'g' suffix, handle strings)
function parseNutrientValue(value: string): number {
  const cleaned = value.replace(/[^\d.]/g, "");
  return parseFloat(cleaned) || 0;
}

async function main() {
  console.log("🌱 Seeding MenuItem from prisma/data/menu.json...");

  const data = menuData as MenuData;
  const menuItems = data.menuItems || [];
  const proteinVariants = data.proteinVariants || [];

  // Clean existing data
  await prisma.nutrient.deleteMany();
  await prisma.menuItem.deleteMany();

  if (menuItems.length === 0) {
    console.warn("No items in prisma/data/menu.json");
    return;
  }
  const categoryNames = Array.from(
    new Set(menuItems.map((i) => i.category).filter(Boolean) as string[])
  );
  const categoryByName = new Map<string, number>();
  for (const name of categoryNames) {
    let cat = await prisma.category.findFirst({ where: { name } });
    if (!cat) cat = await prisma.category.create({ data: { name } });
    categoryByName.set(name, cat.id); // number, not string
  }

  // Create menu items and their protein variants
  for (const item of menuItems) {
    if (typeof item.price !== "number" || !item.category || !categoryByName.has(item.category)) {
      console.warn(`⚠️  Skipping item "${item.title}" - missing required fields`);
      continue;
    }

    // Create menu item
    const menuItem = await prisma.menuItem.create({
      data: {
        title: item.title,
        description: item.description ?? "",
        price: Math.round(item.price),
        imageUrl: item.imageUrl ?? null,
        categoryId: categoryByName.get(item.category)!,
      },
    });

    // Create nutrient records for each protein variant if item has protein variants
    if (item.hasProteinVariants && proteinVariants.length > 0) {
      for (const proteinVariant of proteinVariants) {
        // Create nutrients for regular size
        if (proteinVariant.nutrient.regular) {
          await prisma.nutrient.create({
            data: {
              size: `regular-${proteinVariant.name}`,
              cals: parseNutrientValue(proteinVariant.nutrient.regular.cals),
              protein: parseNutrientValue(proteinVariant.nutrient.regular.protein),
              fat: parseNutrientValue(proteinVariant.nutrient.regular.fat),
              carbs: parseNutrientValue(proteinVariant.nutrient.regular.carbs),
              price: parseInt(proteinVariant.nutrient.regular.price, 10) || 0,
              menuItemId: menuItem.id,
            },
          });
        }

        // Create nutrients for jumbo size
        if (proteinVariant.nutrient.jumbo) {
          await prisma.nutrient.create({
            data: {
              size: `jumbo-${proteinVariant.name}`,
              cals: parseNutrientValue(proteinVariant.nutrient.jumbo.cals),
              protein: parseNutrientValue(proteinVariant.nutrient.jumbo.protein),
              fat: parseNutrientValue(proteinVariant.nutrient.jumbo.fat),
              carbs: parseNutrientValue(proteinVariant.nutrient.jumbo.carbs),
              price: parseInt(proteinVariant.nutrient.jumbo.price, 10) || 0,
              menuItemId: menuItem.id,
            },
          });
        }
      }
      console.log(`✅ Created menu item: ${item.title} (${item.category}) with ${proteinVariants.length} protein variants`);
    } else {
      console.log(`✅ Created menu item: ${item.title} (${item.category})`);
    }
  }

  const menuItemCount = await prisma.menuItem.count();
  const nutrientCount = await prisma.nutrient.count();
  const categoryCount = await prisma.category.count();

  console.log(`\n✅ Seed complete!`);
  console.log(`   Categories: ${categoryCount}`);
  console.log(`   Menu Items: ${menuItemCount}`);
  console.log(`   Nutrients: ${nutrientCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
