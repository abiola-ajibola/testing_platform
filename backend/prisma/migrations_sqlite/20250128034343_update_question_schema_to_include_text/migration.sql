/*
  Warnings:

  - Added the required column `text` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "correctOptionId" INTEGER NOT NULL,
    "explanation" TEXT,
    "explanationImageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" DATETIME NOT NULL,
    CONSTRAINT "Question_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Question_correctOptionId_fkey" FOREIGN KEY ("correctOptionId") REFERENCES "Question_Option" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("correctOptionId", "createdAt", "explanation", "explanationImageUrl", "id", "lastModified", "subjectId") SELECT "correctOptionId", "createdAt", "explanation", "explanationImageUrl", "id", "lastModified", "subjectId" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE UNIQUE INDEX "Question_correctOptionId_key" ON "Question"("correctOptionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
