/*
  Warnings:

  - You are about to drop the column `correctOptionId` on the `Question` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "explanation" TEXT,
    "explanationImageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" DATETIME NOT NULL,
    CONSTRAINT "Question_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("createdAt", "explanation", "explanationImageUrl", "id", "lastModified", "subjectId", "text") SELECT "createdAt", "explanation", "explanationImageUrl", "id", "lastModified", "subjectId", "text" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE TABLE "new_Question_Option" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "image_url" TEXT,
    "correct" BOOLEAN NOT NULL DEFAULT false,
    "questionId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" DATETIME NOT NULL,
    CONSTRAINT "Question_Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Question_Option" ("createdAt", "id", "image_url", "lastModified", "questionId", "text") SELECT "createdAt", "id", "image_url", "lastModified", "questionId", "text" FROM "Question_Option";
DROP TABLE "Question_Option";
ALTER TABLE "new_Question_Option" RENAME TO "Question_Option";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
