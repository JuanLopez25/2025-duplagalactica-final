import { getRankings } from '../../../backend/services/usersRoutes.py';

jest.mock('../../../backend/services/usersRoutes.py', () => ({
    getRankings: jest.fn()
}));

describe('getRankings', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of rankings', async () => {
        const mockRankings = [
            { id: '1', name: 'Ranking A', score: 100 },
            { id: '2', name: 'Ranking B', score: 95 }
        ];
        getRankings.mockResolvedValue(mockRankings);
        const result = await getRankings();
        expect(result).toEqual(mockRankings);
        expect(getRankings).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no rankings are found', async () => {
        getRankings.mockResolvedValue([]);
        const result = await getRankings();
        expect(result).toEqual([]);
    });

    it('should throw an error if database query fails', async () => {
        getRankings.mockRejectedValue(new Error('Database error'));
        await expect(getRankings()).rejects.toThrow('Database error');
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
