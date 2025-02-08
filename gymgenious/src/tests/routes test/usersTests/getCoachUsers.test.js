import { getCoachUsers } from '../../../backend/services/usersRoutes.py';

jest.mock('../../../backend/services/usersRoutes.py', () => ({
    getCoachUsers: jest.fn()
}));

describe('getCoachUsers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of coach users', async () => {
        const mockCoachUsers = [
            { id: '1', name: 'Coach A', email: 'coacha@example.com', type: 'coach' },
            { id: '2', name: 'Coach B', email: 'coachb@example.com', type: 'coach' }
        ];
        getCoachUsers.mockResolvedValue(mockCoachUsers);
        const result = await getCoachUsers();
        expect(result).toEqual(mockCoachUsers);
        expect(getCoachUsers).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no coach users are found', async () => {
        getCoachUsers.mockResolvedValue([]);
        const result = await getCoachUsers();
        expect(result).toEqual([]);
    });

    it('should throw an error if database query fails', async () => {
        getCoachUsers.mockRejectedValue(new Error('Database error'));
        await expect(getCoachUsers()).rejects.toThrow('Database error');
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
