-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question_Option" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "image_url" TEXT,
    "correct" BOOLEAN NOT NULL DEFAULT false,
    "questionId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" DATETIME NOT NULL,
    CONSTRAINT "Question_Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Question_Option" ("correct", "createdAt", "id", "image_url", "lastModified", "questionId", "text") SELECT "correct", "createdAt", "id", "image_url", "lastModified", "questionId", "text" FROM "Question_Option";
DROP TABLE "Question_Option";
ALTER TABLE "new_Question_Option" RENAME TO "Question_Option";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
