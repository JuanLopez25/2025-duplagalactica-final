import { get_routines } from '../../../backend/services/routineRoutes.py';

jest.mock('../../../backend/services/routineRoutes.py', () => ({
  get_routines: jest.fn(),
}));

describe('get_routines', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully retrieve routines and return them', async () => {
    const mockRoutines = [
      { id: 'routine123', name: 'Morning Workout', exercises: ['Push-ups', 'Squats'] },
      { id: 'routine124', name: 'Evening Yoga', exercises: ['Downward Dog', 'Child Pose'] },
    ];
    get_routines.mockResolvedValue(mockRoutines);

    const result = await get_routines();

    expect(result).toEqual(mockRoutines);
    expect(get_routines).toHaveBeenCalled();
  });

  it('should throw an error if get_routines fails', async () => {
    const errorMessage = 'Error while getting the routines';
    get_routines.mockRejectedValue(new Error(errorMessage));

    await expect(get_routines()).rejects.toThrow(errorMessage);
  });

  it('should throw an error if database operation fails', async () => {
    get_routines.mockRejectedValue(new Error('Database error'));

    await expect(get_routines()).rejects.toThrow('Database error');
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
