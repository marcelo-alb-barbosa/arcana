-- CreateTable
CREATE TABLE "RegionalPlanContent" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "features" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "RegionalPlanContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegionalPlanContent_planId_regionId_key" ON "RegionalPlanContent"("planId", "regionId");

-- AddForeignKey
ALTER TABLE "RegionalPlanContent" ADD CONSTRAINT "RegionalPlanContent_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionalPlanContent" ADD CONSTRAINT "RegionalPlanContent_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
