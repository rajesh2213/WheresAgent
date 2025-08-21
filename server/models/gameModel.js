const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient()
const { v4: uuidv4 } = require('uuid');

const createGameSession = async ({ playerName, levelId }) => {
    let data = {
        levelId
    }
    if (!playerName || playerName.trim() === '') {
        data.sessionId = uuidv4()
    } else {
        data.playerName = playerName
    }
    return await prisma.game.create({ data })
}

const getGameById = async (gameId) => {
    return await prisma.game.findUnique({
        where: {
            id: gameId
        }
    })
}

const validateSelection = async (id) => {
    return await prisma.character.findUnique({
        where: {
            id
        }
    })
}

const logFoundCharacter = async (gameId, characterId) => {
    const existing = await prisma.foundCharacter.findUnique({
        where: {
            gameId_characterId: {
                gameId,
                characterId
            }
        }
    })
    if (!existing) {
        return await prisma.foundCharacter.create({
            data: {
                gameId,
                characterId
            }
        })
    } else {
        return existing
    }
}

const getCharactersByGameID = async (gameId) => {
    const game = await prisma.game.findUnique({
        where: { id: gameId },
        select: { levelId: true }
    });

    if (!game) {
        throw new Error("Game not found");
    }

    const characters = await prisma.character.findMany({
        where: { levelId: game.levelId },
        include: {
            foundCharacter: {
                where: { gameId },
                select: { id: true }
            }
        }
    });

    return characters.map((character) => ({
        ...character,
        found: character.foundCharacter.length > 0
    }));
};

const logGame = async (gameId) => {
    return await prisma.game.update({
        where: {
            id: gameId
        },
        data: {
            endedAt: new Date()
        }
    })
}

module.exports = {
    createGameSession,
    getGameById,
    validateSelection,
    logFoundCharacter,
    getCharactersByGameID,
    logGame
}