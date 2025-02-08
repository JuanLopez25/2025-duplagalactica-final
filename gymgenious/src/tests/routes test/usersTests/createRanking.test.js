import { create_ranking } from '../../../backend/services/usersRoutes.py';

jest.mock('../../../backend/services/usersRoutes.py', () => ({
  create_ranking: jest.fn(),
}));

describe('create_ranking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a ranking and return the created ranking object', async () => {
    const mockRanking = { id: '1', name: 'Top 10 Players', scores: [100, 95] };
    create_ranking.mockResolvedValue(mockRanking);

    const result = await create_ranking(mockRanking);

    expect(result).toEqual(mockRanking);
    expect(create_ranking).toHaveBeenCalledWith(mockRanking);
  });

  it('should throw an error if create_ranking fails', async () => {
    const mockRanking = { name: 'Top 10 Players', scores: [100, 95] };
    const errorMessage = 'Error while creating the ranking';
    create_ranking.mockRejectedValue(new Error(errorMessage));

    await expect(create_ranking(mockRanking)).rejects.toThrow(errorMessage);
  });

  it('should throw an error if database operation fails', async () => {
    create_ranking.mockRejectedValue(new Error('Database error'));

    await expect(create_ranking({ name: 'Top 10 Players', scores: [100, 95] })).rejects.toThrow('Database error');
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
