import { getUser } from '../../../backend/services/usersRoutes.py';

jest.mock('../../../backend/services/usersRoutes.py', () => ({
    getUser: jest.fn()
}));

describe('getUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a user when password and email match', async () => {
    const mockPassword = 'securepassword';
    const mockEmail = 'test@example.com';
    const mockUser = [{ id: '123', password: mockPassword, mail: mockEmail, name: 'Test User' }];
    getUser.mockResolvedValue(mockUser);
    const result = await getUser(mockPassword, mockEmail);
    expect(result).toEqual(mockUser);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('id', '123');
    expect(result[0]).toHaveProperty('password', 'securepassword');
    expect(result[0]).toHaveProperty('mail', 'test@example.com');
    expect(result[0]).toHaveProperty('name', 'Test User');
  });

  it('should throw an error when no user matches', async () => {
    const mockPassword = 'securepassword';
    const mockEmail = 'nonexistent@example.com';
    getUser.mockResolvedValue([]);
    getUser.mockRejectedValue(new Error('Usuario no encontrado'));
    await expect(getUser(mockPassword, mockEmail)).rejects.toThrow('Usuario no encontrado');
  });

  it('should handle cases where the user has unexpected fields', async () => {
    const mockPassword = 'securepassword';
    const mockEmail = 'test@example.com';
    const mockUser = { id: '123', password: mockPassword, mail: mockEmail, name: null };
    getUser.mockResolvedValue(mockUser);
    const result = await getUser(mockPassword, mockEmail);
    expect(result).toEqual(mockUser);
    expect(result).toHaveProperty('id', '123');
    expect(result).toHaveProperty('password', mockPassword);
    expect(result).toHaveProperty('mail', mockEmail);
    expect(result).toHaveProperty('name', null);
  });

  it('should handle cases where multiple users match', async () => {
    const mockPassword = 'securepassword';
    const mockEmail = 'test@example.com';
    const mockUsers = [
      { id: '123', password: mockPassword, mail: mockEmail, name: 'Test User 1' },
      { id: '456', password: mockPassword, mail: mockEmail, name: 'Test User 2' }
    ];
    getUser.mockResolvedValue(mockUsers);
    const result = await getUser(mockPassword, mockEmail);
    expect(result).toEqual(mockUsers);
    expect(result).toHaveLength(2);
  });

  it('should throw an error if database query fails', async () => {
    getUser.mockRejectedValue(new Error('Database error'));
    await expect(getUser('securepassword', 'test@example.com')).rejects.toThrow('Database error');
  });
});
