import { create_routine } from '../../../backend/services/routineRoutes.py';

jest.mock('../../../backend/services/routineRoutes.py', () => ({
  create_routine: jest.fn(),
}));

describe('create_routine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully create a routine and return the created routine', async () => {
    const mockRoutine = { name: 'Morning Workout', exercises: ['Push-ups', 'Squats'] };
    const createdRoutine = { ...mockRoutine };
    create_routine.mockResolvedValue(createdRoutine);

    const result = await create_routine(mockRoutine);

    expect(result).toEqual(createdRoutine);
    expect(create_routine).toHaveBeenCalledWith(mockRoutine);
  });

  it('should throw an error if create_routine fails', async () => {
    const mockRoutine = { name: 'Morning Workout', exercises: ['Push-ups', 'Squats'] };
    const errorMessage = 'Error while creating the routine';
    create_routine.mockRejectedValue(new Error(errorMessage));

    await expect(create_routine(mockRoutine)).rejects.toThrow(errorMessage);
  });

  it('should throw an error if database operation fails', async () => {
    create_routine.mockRejectedValue(new Error('Database error'));

    await expect(create_routine({ name: 'Morning Workout', exercises: ['Push-ups', 'Squats'] })).rejects.toThrow('Database error');
  });
});
