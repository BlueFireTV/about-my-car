import { handleLogin } from '../../src/api/users.api';
import { api } from '../../src/api/ky-api';

jest.mock('../../src/api/ky-api', () => ({
  api: {
    post: jest.fn(),
  },
}));

describe('users.api', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleLogin', () => {
    it('should call api.post with correct arguments', async () => {
      (api.post as jest.Mock).mockResolvedValue({ status: 200 });
      const username = 'foo';
      const password = 'bar';

      await handleLogin(username, password);

      expect(api.post).toHaveBeenCalledWith('users/login', { json: { username, password } });
    });
  });
});
