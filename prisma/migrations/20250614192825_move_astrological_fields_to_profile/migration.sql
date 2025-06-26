/*
  Warnings:

  - You are about to drop the column `ascendant` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `birthTime` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `moonSign` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `zodiacSign` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "ascendant",
DROP COLUMN "birthTime",
DROP COLUMN "dateOfBirth",
DROP COLUMN "moonSign",
DROP COLUMN "zodiacSign";

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "birthTime" TEXT,
    "zodiacSign" TEXT,
    "moonSign" TEXT,
    "ascendant" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
