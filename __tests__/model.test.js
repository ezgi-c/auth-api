const bcrypt = require('bcrypt');
const { sequelize, AuthUser } = require('../src/models');

describe('Auth Model', () => {
  beforeEach(() => sequelize.sync());
  afterEach(() => sequelize.drop());

  it('can create a user', async () => {
    const user = await AuthUser.createWithHashed('ezgi', 'loki1');
    expect(user.username).toBe('ezgi');
    expect(bcrypt.compareSync('loki1', user.username));
  });

  describe('findUser', () => {
    it('finds valid user', async () => {
      await AuthUser.createWithHashed('ezgi', 'loki1');
      const user = await AuthUser.findLoggedIn('ezgi', 'loki1');
      expect(user).toBeDefined();
    });

    it('nulls for invalid password', async () => {
      await AuthUser.createWithHashed('ezgi', 'loki1');
      const user = await AuthUser.findLoggedIn('ezgi', 'badpass');
      expect(user).toBe(null);
    });

    it('nulls for missing user', async () => {
      await AuthUser.createWithHashed('ezgi', 'loki1');
      const user = await AuthUser.findLoggedIn('someone', 'loki1');
      expect(user).toBe(null);
    });
  });
});
