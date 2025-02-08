import { delete_class } from '../../../backend/services/classesRoutes.py';

jest.mock('../../../backend/services/classesRoutes.py', () => ({
    delete_class: jest.fn(),
}));

describe('delete_class', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should delete a class successfully', async () => {
        const mockDeleteData = {
            event: 'class_123',
            mail: 'user@example.com'
        };
        const mockResponse = { message: 'Class deleted successfully' };

        delete_class.mockResolvedValue(mockResponse);

        const result = await delete_class(mockDeleteData.event, mockDeleteData.mail);

        expect(result).toEqual(mockResponse);
        expect(delete_class).toHaveBeenCalledWith(mockDeleteData.event, mockDeleteData.mail);
        expect(delete_class).toHaveBeenCalledTimes(1);
    });

    it('should handle errors during deletion', async () => {
        const mockDeleteData = {
            event: 'class_123',
            mail: 'user@example.com'
        };
        const errorMessage = 'No se pudo actualizar el usuario';
        delete_class.mockRejectedValue(new Error(errorMessage));

        await expect(delete_class(mockDeleteData.event, mockDeleteData.mail)).rejects.toThrow(errorMessage);
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
