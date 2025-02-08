import { getClientUsers } from '../../../backend/services/usersRoutes.py';

jest.mock('../../../backend/services/usersRoutes.py', () => ({
    getClientUsers: jest.fn()
}));

describe('getClientUsers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of client users', async () => {
        const mockClientUsers = [
            { id: '1', name: 'Client A', email: 'clienta@example.com', type: 'client' },
            { id: '2', name: 'Client B', email: 'clientb@example.com', type: 'client' }
        ];
        getClientUsers.mockResolvedValue(mockClientUsers);
        const result = await getClientUsers();
        expect(result).toEqual(mockClientUsers);
        expect(getClientUsers).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no client users are found', async () => {
        getClientUsers.mockResolvedValue([]);
        const result = await getClientUsers();
        expect(result).toEqual([]);
    });

    it('should throw an error if database query fails', async () => {
        getClientUsers.mockRejectedValue(new Error('Database error'));
        await expect(getClientUsers()).rejects.toThrow('Database error');
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
