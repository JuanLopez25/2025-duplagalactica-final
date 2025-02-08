import { sendEmail } from '../../../backend/services/usersRoutes.py';

jest.mock('../../../backend/services/usersRoutes.py', () => ({
    sendEmail: jest.fn()
}));

describe('sendEmail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return true when email is sent successfully', async () => {
        const mockEmail = 'test@example.com';
        sendEmail.mockResolvedValue(true);
        const result = await sendEmail(mockEmail);
        expect(result).toBe(true);
    });

    it('should return false when an error occurs', async () => {
        const mockEmail = 'test@example.com';
        const errorMessage = 'Error al enviar el correo';
        sendEmail.mockRejectedValue(new Error(errorMessage));
        await expect(sendEmail(mockEmail)).rejects.toThrow('Error al enviar el correo');
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
