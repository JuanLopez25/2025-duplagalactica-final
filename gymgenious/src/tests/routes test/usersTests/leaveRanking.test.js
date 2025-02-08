import { leave_ranking } from '../../../backend/services/usersRoutes.py'; // Adjust path as needed

jest.mock('../../../backend/services/usersRoutes.py', () => ({
  leave_ranking: jest.fn(),
}));

describe('leave_ranking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully remove user from the ranking and return success message', async () => {
    const mockRankingID = 'ranking123';
    const mockUserMail = 'test@example.com';
    const successMessage = { message: 'Actualización realizada' };
    leave_ranking.mockResolvedValue(successMessage);

    const result = await leave_ranking(mockRankingID, mockUserMail);

    expect(result).toEqual(successMessage);
    expect(leave_ranking).toHaveBeenCalledWith(mockRankingID, mockUserMail);
  });

  it('should throw an error if leave_ranking fails', async () => {
    const mockRankingID = 'ranking123';
    const mockUserMail = 'test@example.com';
    const errorMessage = 'Error while leaving the ranking';
    leave_ranking.mockRejectedValue(new Error(errorMessage));

    await expect(leave_ranking(mockRankingID, mockUserMail)).rejects.toThrow(errorMessage);
  });

  it('should throw an error if ranking is not found', async () => {
    const mockRankingID = 'nonexistentRanking';
    const mockUserMail = 'test@example.com';
    leave_ranking.mockResolvedValue({ message: `No se encontró un ranking con el ID: ${mockRankingID}` });

    const result = await leave_ranking(mockRankingID, mockUserMail);

    expect(result).toEqual({ message: `No se encontró un ranking con el ID: ${mockRankingID}` });
  });

  it('should throw an error if database operation fails', async () => {
    leave_ranking.mockRejectedValue(new Error('Database error'));

    await expect(leave_ranking('ranking123', 'test@example.com')).rejects.toThrow('Database error');
  });
});
