import { use_geme } from '../../../backend/services/usersRoutes.py'; // Adjust path as needed

jest.mock('../../../backend/services/usersRoutes.py', () => ({
  use_geme: jest.fn(),
}));

describe('use_geme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully reduce gem count and return success message', async () => {
    const mockMail = 'test@example.com';
    const successMessage = { message: 'Actualización realizada' };
    use_geme.mockResolvedValue(successMessage);

    const result = await use_geme(mockMail);

    expect(result).toEqual(successMessage);
    expect(use_geme).toHaveBeenCalledWith(mockMail);
  });

  it('should throw an error if use_geme fails', async () => {
    const mockMail = 'test@example.com';
    const errorMessage = 'Error while using gems';
    use_geme.mockRejectedValue(new Error(errorMessage));

    await expect(use_geme(mockMail)).rejects.toThrow(errorMessage);
  });

  it('should return an error message if no user is found with the provided email', async () => {
    const mockMail = 'notfound@example.com';
    use_geme.mockResolvedValue({ message: 'No se encontró un usuario con el correo: notfound@example.com' });

    const result = await use_geme(mockMail);

    expect(result).toEqual({ message: 'No se encontró un usuario con el correo: notfound@example.com' });
  });

  it('should throw an error if database operation fails', async () => {
    use_geme.mockRejectedValue(new Error('Database error'));

    await expect(use_geme('test@example.com')).rejects.toThrow('Database error');
  });
});
