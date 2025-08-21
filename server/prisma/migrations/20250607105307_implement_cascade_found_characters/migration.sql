-- DropForeignKey
ALTER TABLE "found_characters" DROP CONSTRAINT "found_characters_gameId_fkey";

-- AddForeignKey
ALTER TABLE "found_characters" ADD CONSTRAINT "found_characters_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
