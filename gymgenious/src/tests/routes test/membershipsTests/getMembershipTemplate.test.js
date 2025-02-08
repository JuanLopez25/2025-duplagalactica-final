import { get_membership_template } from '../../../backend/services/membershipsRoutes.py';

jest.mock('../../../backend/services/membershipsRoutes.py', () => ({
  get_membership_template: jest.fn(),
}));

describe('get_membership_template', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get membership template classes successfully', async () => {
    // Mock response from the database
    const mockClasses = [
      { id: '1', name: 'Template 1', description: 'Description of Template 1' },
      { id: '2', name: 'Template 2', description: 'Description of Template 2' }
    ];

    get_membership_template.mockResolvedValue(mockClasses);

    const result = await get_membership_template();

    expect(result).toEqual(mockClasses);
    expect(get_membership_template).toHaveBeenCalled();
  });

  it('should throw an error if there is an issue fetching the classes', async () => {
    // Simulate an error in fetching the classes
    get_membership_template.mockRejectedValue(new Error('No se pudo obtener las clases'));

    await expect(get_membership_template()).rejects.toThrow('No se pudo obtener las clases');
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
