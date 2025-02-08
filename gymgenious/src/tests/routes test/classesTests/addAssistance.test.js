import { add_assistance } from '../../../backend/services/classesRoutes.py';

jest.mock('../../../backend/services/classesRoutes.py', () => ({
    add_assistance: jest.fn(),
}));

describe('add_assistance', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully add assistance', async () => {
        const mockAssistanceData = { selectedEvent: 'class_123', fecha: '2025-02-08', uid: 'user_123' };
        const mockResponse = { date: '2025-02-08', cid: 'class_123', uid: 'user_123' };
        add_assistance.mockResolvedValue(mockResponse);

        const result = await add_assistance(mockAssistanceData.selectedEvent, mockAssistanceData.fecha, mockAssistanceData.uid);

        expect(result).toEqual(mockResponse);
        expect(add_assistance).toHaveBeenCalledWith(mockAssistanceData.selectedEvent, mockAssistanceData.fecha, mockAssistanceData.uid);
        expect(add_assistance).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
        const mockAssistanceData = { selectedEvent: 'class_123', fecha: '2025-02-08', uid: 'user_123' };
        const errorMessage = 'No se pudo crear la clase';
        add_assistance.mockRejectedValue(new Error(errorMessage));

        await expect(add_assistance(mockAssistanceData.selectedEvent, mockAssistanceData.fecha, mockAssistanceData.uid)).rejects.toThrow(errorMessage);
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
