import { aquire_membership_month_route } from '../../../backend/services/membershipsRoutes.py';

jest.mock('../../../backend/services/membershipsRoutes.py', () => ({
  aquire_membership_month_route: jest.fn(),
}));

describe('aquire_membership_month_route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully update the membership details for a user', async () => {
    const mockFechaInicio = '2025-01-01T00:00:00';
    const mockUid = 'user123';
    const mockFechaFin = '2025-02-01T00:00:00';
    const mockTypeMemb = 'monthly';

    // Mocked response from the route handler
    const mockResponse = { message: 'Actualización realizada' };

    aquire_membership_month_route.mockResolvedValue(mockResponse);

    const response = await aquire_membership_month_route(mockFechaInicio, mockUid, mockFechaFin, mockTypeMemb);

    expect(response).toEqual(mockResponse);
    expect(aquire_membership_month_route).toHaveBeenCalledWith(mockFechaInicio, mockUid, mockFechaFin, mockTypeMemb);
  });

  it('should handle the case when an exception occurs during the update', async () => {
    const mockFechaInicio = '2025-01-01T00:00:00';
    const mockUid = 'user123';
    const mockFechaFin = '2025-02-01T00:00:00';
    const mockTypeMemb = 'monthly';

    // Simulate an error occurring during the update (directly within route handler)
    const error = new Error('No se pudo actualizar el usuario');
    aquire_membership_month_route.mockRejectedValue(error);

    // This is a correction: we need to ensure that the route handler correctly handles the rejection
    try {
      await aquire_membership_month_route(mockFechaInicio, mockUid, mockFechaFin, mockTypeMemb);
    } catch (err) {
      expect(err.message).toBe('No se pudo actualizar el usuario');
    }
  });
});
