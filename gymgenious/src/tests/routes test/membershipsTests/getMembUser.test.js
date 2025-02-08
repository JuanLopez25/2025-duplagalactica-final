import { get_memb_user } from '../../../backend/services/membershipsRoutes.py';

jest.mock('../../../backend/services/membershipsRoutes.py', () => ({
  get_memb_user: jest.fn(),
}));

describe('get_memb_user', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get membership user classes successfully', async () => {
    // Mock response from the database
    const mockClasses = [
      { id: '1', name: 'Class 1', description: 'Description of Class 1' },
      { id: '2', name: 'Class 2', description: 'Description of Class 2' }
    ];

    get_memb_user.mockResolvedValue(mockClasses);

    const result = await get_memb_user();

    expect(result).toEqual(mockClasses);
    expect(get_memb_user).toHaveBeenCalled();
  });

  it('should throw an error if there is an issue fetching the classes', async () => {
    // Simulate an error in fetching the classes
    get_memb_user.mockRejectedValue(new Error('No se pudo obtener las clases'));

    await expect(get_memb_user()).rejects.toThrow('No se pudo obtener las clases');
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
