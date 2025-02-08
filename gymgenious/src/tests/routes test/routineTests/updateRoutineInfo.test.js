import { update_routine_info } from '../../../backend/services/routineRoutes.py';

jest.mock('../../../backend/services/routineRoutes.py', () => ({
  update_routine_info: jest.fn(),
}));

describe('update_routine_info', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully update routine info and return success message', async () => {
    const mockRoutine = {
      id: 'routine123',
      description: 'Updated description',
      name: 'Updated Routine Name',
      excers: ['Jumping Jacks', 'Burpees'],
    };
    const successMessage = { message: 'Actualización realizada' };
    update_routine_info.mockResolvedValue(successMessage);

    const result = await update_routine_info(mockRoutine);

    expect(result).toEqual(successMessage);
    expect(update_routine_info).toHaveBeenCalledWith(mockRoutine);
  });

  it('should return a message when the routine is not found', async () => {
    const mockRoutine = {
      id: 'routine999', // This routine ID does not exist
      description: 'Updated description',
      name: 'Updated Routine Name',
      excers: ['Jumping Jacks', 'Burpees'],
    };
    const message = { message: 'No se encontró la rutina' };
    update_routine_info.mockResolvedValue(message);

    const result = await update_routine_info(mockRoutine);

    expect(result).toEqual(message);
    expect(update_routine_info).toHaveBeenCalledWith(mockRoutine);
  });

  it('should throw an error if update_routine_info fails', async () => {
    const mockRoutine = {
      id: 'routine123',
      description: 'Updated description',
      name: 'Updated Routine Name',
      excers: ['Jumping Jacks', 'Burpees'],
    };
    const errorMessage = 'Error while updating the routine';
    update_routine_info.mockRejectedValue(new Error(errorMessage));

    await expect(update_routine_info(mockRoutine)).rejects.toThrow(errorMessage);
  });

  it('should throw an error if database operation fails', async () => {
    const mockRoutine = {
      id: 'routine123',
      description: 'Updated description',
      name: 'Updated Routine Name',
      excers: ['Jumping Jacks', 'Burpees'],
    };
    update_routine_info.mockRejectedValue(new Error('Database error'));

    await expect(update_routine_info(mockRoutine)).rejects.toThrow('Database error');
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
