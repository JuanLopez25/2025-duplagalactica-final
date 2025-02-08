import { createUser } from '../../routes/users';

jest.mock('../../firestoreService', () => ({
    createUser: jest.fn()
}));

describe('createUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user and return the user object', async () => {
    const mockUser = { id: '123', name: 'Test User', email: 'test@example.com' };
    createUser.mockResolvedValue(mockUser);
    const result = await createUser(mockUser);
    expect(result).toEqual(mockUser);
  });

  it('should throw an error when createUser fails', async () => {
    const mockUser = { name: 'Test User', email: 'test@example.com' };
    const errorMessage = 'No se pudo crear el usuario';
    createUser.mockRejectedValue(new Error(errorMessage));
    await expect(createUser(mockUser)).rejects.toThrow('No se pudo crear el usuario');
  });

  it('should throw an error if database operation fails', async () => {
    createUser.mockRejectedValue(new Error('Database error'));
    await expect(createUser({ name: 'Test User', email: 'test@example.com' })).rejects.toThrow('Database error');
  });
});
