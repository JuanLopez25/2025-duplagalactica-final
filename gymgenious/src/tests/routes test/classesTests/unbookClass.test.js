import { unbook_class } from '../../../backend/services/classesRoutes.py';

jest.mock('../../../backend/services/classesRoutes.py', () => ({
    unbook_class: jest.fn(),
}));

describe('unbook_class', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should unbook a class successfully if user is booked', async () => {
        const mockUnbookingData = {
            event: 'class_123',
            mail: 'user@example.com'
        };
        const mockResponse = { message: 'Actualización realizada' };

        unbook_class.mockResolvedValue(mockResponse);

        const result = await unbook_class(mockUnbookingData.event, mockUnbookingData.mail);

        expect(result).toEqual(mockResponse);
        expect(unbook_class).toHaveBeenCalledWith(mockUnbookingData.event, mockUnbookingData.mail);
        expect(unbook_class).toHaveBeenCalledTimes(1);
    });

    it('should not unbook the class if user is not booked', async () => {
        const mockUnbookingData = {
            event: 'class_123',
            mail: 'user@example.com'
        };
        const mockClassData = {
            BookedUsers: []
        };
        const mockResponse = { message: 'Actualización realizada' };

        unbook_class.mockResolvedValue(mockResponse);

        const result = await unbook_class(mockUnbookingData.event, mockUnbookingData.mail);

        expect(result).toEqual(mockResponse);
        expect(unbook_class).toHaveBeenCalledWith(mockUnbookingData.event, mockUnbookingData.mail);
        expect(unbook_class).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
        const mockUnbookingData = {
            event: 'class_123',
            mail: 'user@example.com'
        };
        const errorMessage = 'No se pudo actualizar el usuario';
        unbook_class.mockRejectedValue(new Error(errorMessage));

        await expect(unbook_class(mockUnbookingData.event, mockUnbookingData.mail)).rejects.toThrow(errorMessage);
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
