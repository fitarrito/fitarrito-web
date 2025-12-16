/*
  Warnings:

  - You are about to alter the column `cals` on the `Nutrient` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `carbs` on the `Nutrient` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `fat` on the `Nutrient` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `price` on the `Nutrient` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `protein` on the `Nutrient` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Nutrient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "size" TEXT NOT NULL,
    "cals" REAL NOT NULL,
    "protein" REAL NOT NULL,
    "fat" REAL NOT NULL,
    "carbs" REAL NOT NULL,
    "price" INTEGER NOT NULL,
    "menuItemId" INTEGER NOT NULL,
    CONSTRAINT "Nutrient_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Nutrient" ("cals", "carbs", "fat", "id", "menuItemId", "price", "protein", "size") SELECT "cals", "carbs", "fat", "id", "menuItemId", "price", "protein", "size" FROM "Nutrient";
DROP TABLE "Nutrient";
ALTER TABLE "new_Nutrient" RENAME TO "Nutrient";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
