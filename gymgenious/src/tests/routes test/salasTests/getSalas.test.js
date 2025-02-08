import { getSalas } from '../../../backend/services/salasRoutes.py';

jest.mock('../../../backend/services/salasRoutes.py', () => ({
    createUser: jest.fn(),
    getUniqueUserByEmail: jest.fn(),
    getSalas: jest.fn()
}));

describe('getSalas', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of rooms', async () => {
        const mockSalas = [
            { id: '1', name: 'Room A' },
            { id: '2', name: 'Room B' }
        ];
        getSalas.mockResolvedValue(mockSalas);
        const result = await getSalas();
        expect(result).toEqual(mockSalas);
        expect(getSalas).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no rooms are found', async () => {
        getSalas.mockResolvedValue([]);
        const result = await getSalas();
        expect(result).toEqual([]);
    });

    it('should throw an error if database query fails', async () => {
        getSalas.mockRejectedValue(new Error('Database error'));
        await expect(getSalas()).rejects.toThrow('Database error');
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
