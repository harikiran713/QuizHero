/*
  Warnings:

  - The values [mcq,open_ended] on the enum `GameType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GameType_new" AS ENUM ('general', 'neet', 'upsc', 'jee_inorganic');
ALTER TABLE "Game" ALTER COLUMN "gameType" TYPE "GameType_new" USING ("gameType"::text::"GameType_new");
ALTER TABLE "Question" ALTER COLUMN "questionType" TYPE "GameType_new" USING ("questionType"::text::"GameType_new");
ALTER TYPE "GameType" RENAME TO "GameType_old";
ALTER TYPE "GameType_new" RENAME TO "GameType";
DROP TYPE "GameType_old";
COMMIT;
