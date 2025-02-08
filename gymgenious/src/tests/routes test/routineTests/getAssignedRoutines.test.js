import { get_assigned_routines } from '../../../backend/services/routineRoutes.py';

jest.mock('../../../backend/services/routineRoutes.py', () => ({
  get_assigned_routines: jest.fn(),
}));

describe('get_assigned_routines', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully retrieve assigned routines and return them', async () => {
    const mockAssignedRoutines = [
      { id: 'assigned123', assigner: 'trainer@example.com', day: 'Monday', users: ['user1@example.com'] },
      { id: 'assigned124', assigner: 'trainer@example.com', day: 'Tuesday', users: ['user2@example.com'] },
    ];
    get_assigned_routines.mockResolvedValue(mockAssignedRoutines);

    const result = await get_assigned_routines();

    expect(result).toEqual(mockAssignedRoutines);
    expect(get_assigned_routines).toHaveBeenCalled();
  });

  it('should throw an error if get_assigned_routines fails', async () => {
    const errorMessage = 'Error while getting the assigned routines';
    get_assigned_routines.mockRejectedValue(new Error(errorMessage));

    await expect(get_assigned_routines()).rejects.toThrow(errorMessage);
  });

  it('should throw an error if database operation fails', async () => {
    get_assigned_routines.mockRejectedValue(new Error('Database error'));

    await expect(get_assigned_routines()).rejects.toThrow('Database error');
  });
});
