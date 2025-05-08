-- CreateTable
CREATE TABLE "Inventory" (
    "id" SERIAL NOT NULL,
    "sku" TEXT NOT NULL,
    "available" INTEGER NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_sku_key" ON "Inventory"("sku");
