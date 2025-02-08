import { getUniqueUserByEmail } from '../../../backend/services/usersRoutes.py';

jest.mock('../../../backend/services/usersRoutes.py', () => ({
    getUniqueUserByEmail: jest.fn(),
}));

describe('getUniqueUserByEmail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a user when email matches', async () => {
        const mockEmail = 'test@example.com';
        const mockUser = { id: '123', Mail: mockEmail, name: 'Test User' };
        getUniqueUserByEmail.mockResolvedValue(mockUser);
        const result = await getUniqueUserByEmail(mockEmail);
        expect(result).toEqual(mockUser);
        expect(getUniqueUserByEmail).toHaveBeenCalledWith(mockEmail);
        expect(getUniqueUserByEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when no user matches', async () => {
        const mockEmail = 'nonexistent@example.com';
        getUniqueUserByEmail.mockRejectedValue(new Error('No existen usuarios con ese mail'));
        await expect(getUniqueUserByEmail(mockEmail)).rejects.toThrow('No existen usuarios con ese mail');
    });
});
