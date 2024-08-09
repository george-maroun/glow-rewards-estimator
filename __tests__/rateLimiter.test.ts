// Mock the entire @vercel/kv module
jest.mock('@vercel/kv', () => ({
  kv: {
    multi: jest.fn(),
  },
}));

import { checkRateLimit } from '../src/app/actions/actions'; // Import the function
import { kv } from '@vercel/kv';

describe('checkRateLimit', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should allow requests within the rate limit', async () => {
    const mockExec = jest.fn().mockResolvedValue([null, null, 10, null]);
    const mockMulti = {
      zremrangebyscore: jest.fn().mockReturnThis(),
      zadd: jest.fn().mockReturnThis(),
      zcard: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      exec: mockExec,
    };
    (kv.multi as jest.Mock).mockReturnValue(mockMulti);

    const result = await checkRateLimit('test-key');
    expect(result).toBe(true);
  });

  it('should block requests exceeding the rate limit', async () => {
    const mockExec = jest.fn().mockResolvedValue([null, null, 21, null]);
    const mockMulti = {
      zremrangebyscore: jest.fn().mockReturnThis(),
      zadd: jest.fn().mockReturnThis(),
      zcard: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      exec: mockExec,
    };
    (kv.multi as jest.Mock).mockReturnValue(mockMulti);

    const result = await checkRateLimit('test-key');
    expect(result).toBe(false);
  });
});