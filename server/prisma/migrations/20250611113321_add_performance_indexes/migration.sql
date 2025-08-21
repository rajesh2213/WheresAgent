-- CreateIndex
CREATE INDEX "idx_characters_levelid" ON "characters"("levelId");

-- CreateIndex
CREATE INDEX "idx_foundcharacters_gameid" ON "found_characters"("gameId");

-- CreateIndex
CREATE INDEX "idx_foundcharacters_gameid_foundat" ON "found_characters"("gameId", "foundAt");

-- CreateIndex
CREATE INDEX "idx_games_levelid" ON "games"("levelId");

-- CreateIndex
CREATE INDEX "idx_games_startedat" ON "games"("startedAt");

-- CreateIndex
CREATE INDEX "idx_games_endedat" ON "games"("endedAt");

-- CreateIndex
CREATE INDEX "idx_games_levelid_endedat" ON "games"("levelId", "endedAt");
