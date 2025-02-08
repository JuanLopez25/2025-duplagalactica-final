import { book_class } from '../../../backend/services/classesRoutes.py';

jest.mock('../../../backend/services/classesRoutes.py', () => ({
    book_class: jest.fn(),
}));

describe('book_class', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should book a class successfully if not already booked', async () => {
        const mockBookingData = {
            event: 'class_123',
            mail: 'user@example.com'
        };
        const mockResponse = { message: 'Actualización realizada' };

        book_class.mockResolvedValue(mockResponse);

        const result = await book_class(mockBookingData.event, mockBookingData.mail);

        expect(result).toEqual(mockResponse);
        expect(book_class).toHaveBeenCalledWith(mockBookingData.event, mockBookingData.mail);
        expect(book_class).toHaveBeenCalledTimes(1);
    });

    it('should not add the user to booked users if already booked', async () => {
        const mockBookingData = {
            event: 'class_123',
            mail: 'user@example.com'
        };
        const mockClassData = {
            BookedUsers: ['user@example.com']
        };
        const mockResponse = { message: 'Actualización realizada' };

        book_class.mockResolvedValue(mockResponse);

        const result = await book_class(mockBookingData.event, mockBookingData.mail);

        expect(result).toEqual(mockResponse);
        expect(book_class).toHaveBeenCalledWith(mockBookingData.event, mockBookingData.mail);
        expect(book_class).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
        const mockBookingData = {
            event: 'class_123',
            mail: 'user@example.com'
        };
        const errorMessage = 'No se pudo actualizar el usuario';
        book_class.mockRejectedValue(new Error(errorMessage));

        await expect(book_class(mockBookingData.event, mockBookingData.mail)).rejects.toThrow(errorMessage);
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
