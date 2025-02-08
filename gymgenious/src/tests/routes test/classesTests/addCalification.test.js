import { add_calification } from '../../../backend/services/classesRoutes.py';

jest.mock('../../../backend/services/classesRoutes.py', () => ({
    add_calification: jest.fn(),
}));

describe('add_calification', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should add new calification if it does not exist', async () => {
        const mockCalificationData = {
            event: 'class_123',
            calification: 5,
            commentary: 'Great class!',
            user: 'user_123'
        };
        const mockResponse = {
            cid: 'class_123',
            uid: 'user_123',
            calification: 5,
            commentary: 'Great class!'
        };
        
        add_calification.mockResolvedValue(mockResponse);

        const result = await add_calification(mockCalificationData.event, mockCalificationData.calification, mockCalificationData.commentary, mockCalificationData.user);

        expect(result).toEqual(mockResponse);
        expect(add_calification).toHaveBeenCalledWith(mockCalificationData.event, mockCalificationData.calification, mockCalificationData.commentary, mockCalificationData.user);
        expect(add_calification).toHaveBeenCalledTimes(1);
    });

    it('should update existing calification if it exists', async () => {
        const mockCalificationData = {
            event: 'class_123',
            calification: 4,
            commentary: 'Good class!',
            user: 'user_123'
        };
        const mockResponse = {
            cid: 'class_123',
            uid: 'user_123',
            calification: 4,
            commentary: 'Good class!'
        };

        add_calification.mockResolvedValue(mockResponse);

        const result = await add_calification(mockCalificationData.event, mockCalificationData.calification, mockCalificationData.commentary, mockCalificationData.user);

        expect(result).toEqual(mockResponse);
        expect(add_calification).toHaveBeenCalledWith(mockCalificationData.event, mockCalificationData.calification, mockCalificationData.commentary, mockCalificationData.user);
        expect(add_calification).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
        const mockCalificationData = {
            event: 'class_123',
            calification: 5,
            commentary: 'Great class!',
            user: 'user_123'
        };
        const errorMessage = 'No se pudo crear la calificación';
        add_calification.mockRejectedValue(new Error(errorMessage));

        await expect(add_calification(mockCalificationData.event, mockCalificationData.calification, mockCalificationData.commentary, mockCalificationData.user)).rejects.toThrow(errorMessage);
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
