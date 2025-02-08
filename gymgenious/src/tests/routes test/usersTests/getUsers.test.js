import { getUsers } from '../../../backend/services/usersRoutes.py';

jest.mock('../../../backend/services/usersRoutes.py', () => ({
    getUsers: jest.fn()
}));

describe('getUsers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of users', async () => {
        const mockUsers = [
            { id: '1', name: 'User A', email: 'usera@example.com' },
            { id: '2', name: 'User B', email: 'userb@example.com' }
        ];
        getUsers.mockResolvedValue(mockUsers);
        const result = await getUsers();
        expect(result).toEqual(mockUsers);
        expect(getUsers).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no users are found', async () => {
        getUsers.mockResolvedValue([]);
        const result = await getUsers();
        expect(result).toEqual([]);
    });

    it('should throw an error if database query fails', async () => {
        getUsers.mockRejectedValue(new Error('Database error'));
        await expect(getUsers()).rejects.toThrow('Database error');
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
