/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,friendId]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Friend_ownerId_friendId_key" ON "Friend"("ownerId", "friendId");
