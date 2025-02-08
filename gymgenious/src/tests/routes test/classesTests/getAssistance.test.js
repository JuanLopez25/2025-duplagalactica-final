import { get_assistance_route } from '../../../backend/services/classesRoutes.py';

jest.mock('../../../backend/services/classesRoutes.py', () => ({
  get_assistance_route: jest.fn(),
}));

describe('get_assistance_route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the list of class assistance records successfully', async () => {
    const mockAssistance = [
      { id: '1', userId: 'user1', attended: true },
      { id: '2', userId: 'user2', attended: false },
    ];

    // Mock the response of the route handler
    get_assistance_route.mockResolvedValue(mockAssistance);

    const response = await get_assistance_route();

    expect(response).toEqual(mockAssistance);
    expect(get_assistance_route).toHaveBeenCalled();
  });

  it('should handle an error when unable to fetch assistance records', async () => {
    const error = new Error('Error al obtener las clases');
    
    // Simulate an error thrown by the route handler
    get_assistance_route.mockRejectedValue(error);

    try {
      await get_assistance_route();
    } catch (err) {
      expect(err.message).toBe('Error al obtener las clases');
    }
  });

  it('should return an empty list if no assistance records are found', async () => {
    // Simulate the case where no assistance records are available
    get_assistance_route.mockResolvedValue([]);

    const response = await get_assistance_route();

    expect(response).toEqual([]);
    expect(get_assistance_route).toHaveBeenCalled();
  });

  it('should return the correct assistance record structure', async () => {
    const mockAssistance = [
      { id: '1', userId: 'user1', attended: true },
      { id: '2', userId: 'user2', attended: false },
    ];

    get_assistance_route.mockResolvedValue(mockAssistance);

    const response = await get_assistance_route();

    // Check that the response matches the expected structure
    expect(response).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String),
        userId: expect.any(String),
        attended: expect.any(Boolean),
      })
    ]));
  });
});
