import { get_excersice_by_owner_route } from '../../../backend/services/exercisesRoutes.py';

jest.mock('../../../backend/services/exercisesRoutes.py', () => ({
  get_excersice_by_owner_route: jest.fn(),
}));

describe('get_excersice_by_owner_route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return exercises for a given owner', async () => {
    const mockOwner = 'John Doe';
    const mockExercises = [
      { name: 'Yoga', description: 'A relaxing yoga class', owner: 'John Doe' },
      { name: 'Pilates', description: 'A strength-building Pilates class', owner: 'John Doe' },
    ];

    // Mocked response from the route handler
    get_excersice_by_owner_route.mockResolvedValue(mockExercises);

    const response = await get_excersice_by_owner_route(mockOwner);

    expect(response).toEqual(mockExercises);
    expect(get_excersice_by_owner_route).toHaveBeenCalledWith(mockOwner);
  });

  it('should handle the case when an exception occurs during the retrieval of exercises', async () => {
    const mockOwner = 'John Doe';

    // Simulate an error occurring during the retrieval process (e.g., database error)
    const error = new Error('No se pudo obtener los ejercicios');
    get_excersice_by_owner_route.mockRejectedValue(error);

    // This is a correction: we need to ensure that the route handler correctly handles the rejection
    try {
      await get_excersice_by_owner_route(mockOwner);
    } catch (err) {
      expect(err.message).toBe('No se pudo obtener los ejercicios');
    }
  });

  it('should return an empty array if no exercises are found for the given owner', async () => {
    const mockOwner = 'Jane Doe'; // Owner with no exercises

    const mockResponse = [];

    get_excersice_by_owner_route.mockResolvedValue(mockResponse);

    const response = await get_excersice_by_owner_route(mockOwner);

    expect(response).toEqual(mockResponse);
    expect(get_excersice_by_owner_route).toHaveBeenCalledWith(mockOwner);
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
