const request = require('supertest');
const { PrismaClient } = require('../../generated/prisma');
const app = require('../../app');

const prisma = new PrismaClient();
const LEVEL_ID = '01c2415a-7afe-4b01-9d7d-3524d14b35e8';

describe('Game Routes', () => {

  describe('POST /game', () => {
    it('should create a new game', async () => {
      const response = await request(app)
        .post('/game')
        .send({
          levelId: LEVEL_ID,
          playerName: 'Test Player',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.game).toHaveProperty('id');
      expect(response.body.game.levelId).toBe(LEVEL_ID);
      expect(response.body.game.playerName).toBe('Test Player');
    });

    it('should return 400 if levelId is missing', async () => {
      const response = await request(app)
        .post('/game')
        .send({
          playerName: 'Test Player',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /game/:gameId/characters', () => {
    it('should get characters for a game', async () => {
      const game = await prisma.game.create({
        data: {
          levelId: LEVEL_ID,
          playerName: 'Test Player 2',
        },
      });

      const response = await request(app)
        .get(`/game/${game.id}/characters`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.characters)).toBe(true);
    });

    it('should return 404 for non-existent game', async () => {
      const response = await request(app)
        .get('/game/non-existent-id/characters');

      expect(response.status).toBe(404);
    });
  });
}); 