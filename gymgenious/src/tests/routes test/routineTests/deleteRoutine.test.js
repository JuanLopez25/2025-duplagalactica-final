import { delete_routine } from '../../../backend/services/routineRoutes.py';

jest.mock('../../../backend/services/routineRoutes.py', () => ({
  delete_routine: jest.fn(),
}));

describe('delete_routine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully delete a routine and return a success message', async () => {
    const mockEvent = { id: 'routine123' };
    const successMessage = { message: 'Rutina eliminada correctamente' };
    delete_routine.mockResolvedValue(successMessage);

    const result = await delete_routine(mockEvent);

    expect(result).toEqual(successMessage);
    expect(delete_routine).toHaveBeenCalledWith(mockEvent);
  });

  it('should return a message when the routine is not found', async () => {
    const mockEvent = { id: 'routine999' }; // This routine ID does not exist
    const message = { message: 'No se encontró la rutina' };
    delete_routine.mockResolvedValue(message);

    const result = await delete_routine(mockEvent);

    expect(result).toEqual(message);
    expect(delete_routine).toHaveBeenCalledWith(mockEvent);
  });

  it('should throw an error if delete_routine fails', async () => {
    const mockEvent = { id: 'routine123' };
    const errorMessage = 'Error while deleting the routine';
    delete_routine.mockRejectedValue(new Error(errorMessage));

    await expect(delete_routine(mockEvent)).rejects.toThrow(errorMessage);
  });

  it('should throw an error if database operation fails', async () => {
    const mockEvent = { id: 'routine123' };
    delete_routine.mockRejectedValue(new Error('Database error'));

    await expect(delete_routine(mockEvent)).rejects.toThrow('Database error');
  });
});
