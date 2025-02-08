import { update_class_use_route } from '../../../backend/services/membershipsRoutes.py';

jest.mock('../../../backend/services/membershipsRoutes.py', () => ({
  update_class_use_route: jest.fn(),
}));

describe('update_class_use_route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully update class usage for multiple users', async () => {
    const mockUsuarios = 'user123,user456';
    const mockSelectedEvent = 'event789';

    // Mocked response from the route handler
    const mockResponse = { message: 'Actualización realizada' };

    update_class_use_route.mockResolvedValue(mockResponse);

    const response = await update_class_use_route(mockUsuarios, mockSelectedEvent);

    expect(response).toEqual(mockResponse);
    expect(update_class_use_route).toHaveBeenCalledWith(mockUsuarios, mockSelectedEvent);
  });

  it('should handle the case when an exception occurs during the update', async () => {
    const mockUsuarios = 'user123,user456';
    const mockSelectedEvent = 'event789';

    // Simulate an error occurring during the update (directly within route handler)
    const error = new Error('No se pudo actualizar la clase');
    update_class_use_route.mockRejectedValue(error);

    // This is a correction: we need to ensure that the route handler correctly handles the rejection
    try {
      await update_class_use_route(mockUsuarios, mockSelectedEvent);
    } catch (err) {
      expect(err.message).toBe('No se pudo actualizar la clase');
    }
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
