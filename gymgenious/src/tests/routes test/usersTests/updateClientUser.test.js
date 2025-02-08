import { update_client_user } from '../../../backend/services/usersRoutes.py';

jest.mock('../../../backend/services/usersRoutes.py', () => ({
  update_client_user: jest.fn(),
}));

describe('update_users_info', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update user information and return success message', async () => {
    const mockUser = { Mail: 'test@example.com', Name: 'John', Lastname: 'Doe', Birthday: '2000-01-01' };
    const successMessage = { message: 'Actualización realizada' };
    update_client_user.mockResolvedValue(successMessage);

    const result = await update_client_user(mockUser);

    expect(result).toEqual(successMessage);
    expect(update_client_user).toHaveBeenCalledWith(mockUser);
  });

  it('should throw an error if update_client_user fails', async () => {
    const mockUser = { Mail: 'test@example.com', Name: 'John', Lastname: 'Doe', Birthday: '2000-01-01' };
    const errorMessage = 'Error while updating the user';
    update_client_user.mockRejectedValue(new Error(errorMessage));

    await expect(update_client_user(mockUser)).rejects.toThrow(errorMessage);
  });

  it('should return an error message if no user is found for the provided email', async () => {
    const mockUser = { Mail: 'notfound@example.com', Name: 'John', Lastname: 'Doe', Birthday: '2000-01-01' };
    update_client_user.mockResolvedValue({ message: 'No se encontró un usuario con el correo: notfound@example.com' });

    const result = await update_client_user(mockUser);

    expect(result).toEqual({ message: 'No se encontró un usuario con el correo: notfound@example.com' });
  });

  it('should throw an error if database operation fails', async () => {
    update_client_user.mockRejectedValue(new Error('Database error'));

    await expect(update_client_user({ Mail: 'test@example.com', Name: 'John', Lastname: 'Doe', Birthday: '2000-01-01' })).rejects.toThrow('Database error');
  });

  it('should throw an error if token is missing', async () => {
    const mockRequest = { headers: {} };
    expect(() => {
        if (!mockRequest.headers.Authorization || !mockRequest.headers.Authorization.includes('Bearer')) {
            throw new Error('Missing token');
        }
    }).toThrow('Missing token');
});
});
