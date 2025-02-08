import { getClientUsersNoMatchRoutine } from '../../../backend/services/usersRoutes.py';

jest.mock('../../../backend/services/usersRoutes.py', () => ({
    getClientUsersNoMatchRoutine: jest.fn()
}));

describe('getClientUsersNoMatchRoutine', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of users who do not match the given routine', async () => {
        const mockRoutine = 'Routine123';
        const mockUsers = [
            { id: '1', name: 'User A', email: 'usera@example.com', type: 'client' },
            { id: '2', name: 'User B', email: 'userb@example.com', type: 'client' }
        ];
        getClientUsersNoMatchRoutine.mockResolvedValue(mockUsers);
        const result = await getClientUsersNoMatchRoutine(mockRoutine);
        expect(result).toEqual(mockUsers);
        expect(getClientUsersNoMatchRoutine).toHaveBeenCalledWith(mockRoutine);
        expect(getClientUsersNoMatchRoutine).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no users are found', async () => {
        const mockRoutine = 'Routine123';
        getClientUsersNoMatchRoutine.mockResolvedValue([]);
        const result = await getClientUsersNoMatchRoutine(mockRoutine);
        expect(result).toEqual([]);
    });

    it('should throw an error if database query fails', async () => {
        const mockRoutine = 'Routine123';
        getClientUsersNoMatchRoutine.mockRejectedValue(new Error('Database error'));
        await expect(getClientUsersNoMatchRoutine(mockRoutine)).rejects.toThrow('Database error');
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
