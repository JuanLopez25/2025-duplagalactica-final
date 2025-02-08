import { assign_routine_to_user } from '../../../backend/services/routineRoutes.py';

jest.mock('../../../backend/services/routineRoutes.py', () => ({
  assign_routine_to_user: jest.fn(),
}));

describe('assign_routine_to_user', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully assign routine to user and return success message', async () => {
    const mockAssignRoutine = {
      assigner: 'trainer@example.com',
      day: 'Monday',
      id: 'routine123',
      owner: 'user@example.com',
      user: [{ Mail: 'user1@example.com' }, { Mail: 'user2@example.com' }]
    };
    const successMessage = { message: 'Actualización realizada' };
    assign_routine_to_user.mockResolvedValue(successMessage);

    const result = await assign_routine_to_user(mockAssignRoutine);

    expect(result).toEqual(successMessage);
    expect(assign_routine_to_user).toHaveBeenCalledWith(mockAssignRoutine);
  });

  it('should create a new routine assignment if no matching document is found', async () => {
    const mockAssignRoutine = {
      assigner: 'trainer@example.com',
      day: 'Monday',
      id: 'routine123',
      owner: 'user@example.com',
      user: [{ Mail: 'user1@example.com' }, { Mail: 'user2@example.com' }]
    };
    const newDocRef = { id: 'newDoc123' };
    assign_routine_to_user.mockResolvedValue(newDocRef);

    const result = await assign_routine_to_user(mockAssignRoutine);

    expect(result).toEqual(newDocRef);
    expect(assign_routine_to_user).toHaveBeenCalledWith(mockAssignRoutine);
  });

  it('should throw an error if assign_routine_to_user fails', async () => {
    const mockAssignRoutine = {
      assigner: 'trainer@example.com',
      day: 'Monday',
      id: 'routine123',
      owner: 'user@example.com',
      user: [{ Mail: 'user1@example.com' }]
    };
    const errorMessage = 'Error while assigning the routine';
    assign_routine_to_user.mockRejectedValue(new Error(errorMessage));

    await expect(assign_routine_to_user(mockAssignRoutine)).rejects.toThrow(errorMessage);
  });

  it('should throw an error if database operation fails', async () => {
    const mockAssignRoutine = {
      assigner: 'trainer@example.com',
      day: 'Monday',
      id: 'routine123',
      owner: 'user@example.com',
      user: [{ Mail: 'user1@example.com' }]
    };
    assign_routine_to_user.mockRejectedValue(new Error('Database error'));

    await expect(assign_routine_to_user(mockAssignRoutine)).rejects.toThrow('Database error');
  });
});
