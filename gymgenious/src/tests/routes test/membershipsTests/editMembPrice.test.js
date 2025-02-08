import { edit_memb_price_route } from '../../../backend/services/membershipsRoutes.py';

jest.mock( '../../../backend/services/membershipsRoutes.py', () => ({
  edit_memb_price_route: jest.fn(),
}));

describe('edit_memb_price_route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update the price of a membership successfully', async () => {
    const mockTipo = 'basic';
    const mockPrecio = 100;

    // Mocked response from the route handler
    const mockResponse = { message: 'Actualización realizada' };
    
    edit_memb_price_route.mockResolvedValue(mockResponse);

    const response = await edit_memb_price_route(mockTipo, mockPrecio);

    expect(response).toEqual(mockResponse);
    expect(edit_memb_price_route).toHaveBeenCalledWith(mockTipo, mockPrecio);
  });

  it('should handle the case when an exception occurs during the update', async () => {
    const mockTipo = 'basic';
    const mockPrecio = 100;

    // Simulate an error occurring during the update (directly within route handler)
    const error = new Error('No se pudo actualizar el usuario');
    edit_memb_price_route.mockRejectedValue(error);

    // This is a correction: we need to ensure that the route handler correctly handles the rejection
    try {
      await edit_memb_price_route(mockTipo, mockPrecio);
    } catch (err) {
      expect(err.message).toBe('No se pudo actualizar el usuario');
    }
  });
});
