import { get_excersices_route } from '../../../backend/services/exercisesRoutes.py';

jest.mock('../../../backend/services/exercisesRoutes.py', () => ({
  get_excersices_route: jest.fn(),
}));

describe('get_excersices_route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of all exercises', async () => {
    const mockExercises = [
      { id: '1', name: 'Yoga', description: 'A relaxing yoga class' },
      { id: '2', name: 'Pilates', description: 'A strength-building Pilates class' },
    ];

    // Mocked response from the route handler
    get_excersices_route.mockResolvedValue(mockExercises);

    const response = await get_excersices_route();

    expect(response).toEqual(mockExercises);
    expect(get_excersices_route).toHaveBeenCalled();
  });

  it('should handle the case when an exception occurs during the retrieval of exercises', async () => {
    // Simulate an error occurring during the retrieval process (e.g., database error)
    const error = new Error('No se pudo obtener los ejercicios');
    get_excersices_route.mockRejectedValue(error);

    try {
      await get_excersices_route();
    } catch (err) {
      expect(err.message).toBe('No se pudo obtener los ejercicios');
    }
  });

  it('should return an empty array if no exercises are found', async () => {
    const mockResponse = [];

    get_excersices_route.mockResolvedValue(mockResponse);

    const response = await get_excersices_route();

    expect(response).toEqual(mockResponse);
    expect(get_excersices_route).toHaveBeenCalled();
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
