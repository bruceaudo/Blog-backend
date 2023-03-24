/*
  Warnings:

  - You are about to drop the column `authorId` on the `Likes` table. All the data in the column will be lost.
  - You are about to drop the column `liked` on the `Likes` table. All the data in the column will be lost.
  - Added the required column `likedBy` to the `Likes` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Likes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER NOT NULL,
    "likedBy" INTEGER NOT NULL,
    CONSTRAINT "Likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Likes_likedBy_fkey" FOREIGN KEY ("likedBy") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Likes" ("id", "postId") SELECT "id", "postId" FROM "Likes";
DROP TABLE "Likes";
ALTER TABLE "new_Likes" RENAME TO "Likes";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
