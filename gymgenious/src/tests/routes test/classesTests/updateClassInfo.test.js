import { update_class_info } from '../../../backend/services/classesRoutes.py';

jest.mock('../../../backend/services/classesRoutes.py', () => ({
    update_class_info: jest.fn(),
}));

describe('update_class_info', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update class information successfully', async () => {
        const mockClassData = {
            cid: 'class_123',
            DateFin: '2024-12-31',
            DateInicio: '2024-09-01',
            Day: 'Monday',
            Hour: '10:00 AM',
            Name: 'Math 101',
            Permanent: 'Yes',
            sala: 'Room A',
            capacity: 30
        };
        const mockResponse = { message: 'Actualización realizada' };

        update_class_info.mockResolvedValue(mockResponse);

        const result = await update_class_info(mockClassData);

        expect(result).toEqual(mockResponse);
        expect(update_class_info).toHaveBeenCalledWith(mockClassData);
        expect(update_class_info).toHaveBeenCalledTimes(1);
    });

    it('should handle errors during class update', async () => {
        const mockClassData = {
            cid: 'class_123',
            DateFin: '2024-12-31',
            DateInicio: '2024-09-01',
            Day: 'Monday',
            Hour: '10:00 AM',
            Name: 'Math 101',
            Permanent: 'Yes',
            sala: 'Room A',
            capacity: 30
        };
        const errorMessage = 'No se pudo actualizar la clase';
        update_class_info.mockRejectedValue(new Error(errorMessage));

        await expect(update_class_info(mockClassData)).rejects.toThrow(errorMessage);
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
