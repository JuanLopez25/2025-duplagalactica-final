import { join_ranking } from '../../../backend/services/usersRoutes.py'; // Adjust path as needed

jest.mock('../../../backend/services/usersRoutes.py', () => ({
  join_ranking: jest.fn(),
}));

describe('join_ranking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully add user to the ranking and return success message', async () => {
    const mockRankingID = 'ranking123';
    const mockUserMail = 'test@example.com';
    const successMessage = { message: 'Actualización realizada' };
    join_ranking.mockResolvedValue(successMessage);

    const result = await join_ranking(mockRankingID, mockUserMail);

    expect(result).toEqual(successMessage);
    expect(join_ranking).toHaveBeenCalledWith(mockRankingID, mockUserMail);
  });

  it('should throw an error if join_ranking fails', async () => {
    const mockRankingID = 'ranking123';
    const mockUserMail = 'test@example.com';
    const errorMessage = 'Error joining the ranking';
    join_ranking.mockRejectedValue(new Error(errorMessage));

    await expect(join_ranking(mockRankingID, mockUserMail)).rejects.toThrow(errorMessage);
  });

  it('should throw an error if ranking is not found', async () => {
    const mockRankingID = 'nonexistentRanking';
    const mockUserMail = 'test@example.com';
    join_ranking.mockResolvedValue({ message: `No se encontró un ranking con el ID: ${mockRankingID}` });

    const result = await join_ranking(mockRankingID, mockUserMail);

    expect(result).toEqual({ message: `No se encontró un ranking con el ID: ${mockRankingID}` });
  });

  it('should throw an error if database operation fails', async () => {
    join_ranking.mockRejectedValue(new Error('Database error'));

    await expect(join_ranking('ranking123', 'test@example.com')).rejects.toThrow('Database error');
  });
});
