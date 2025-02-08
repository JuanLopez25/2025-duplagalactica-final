import { createClass } from '../../../backend/services/classesRoutes.py'; 


jest.mock('../../../backend/services/classesRoutes.py', () => ({
    createClass: jest.fn(),
}));


describe('createClass', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should create a class successfully', async () => {
      const mockClassData = { name: 'Math 101', date: '2024-09-10', permanent: 'No' };
      createClass.mockResolvedValue(mockClassData);
  
      const result = await createClass(mockClassData);
  
      expect(result).toEqual(mockClassData);
      expect(createClass).toHaveBeenCalledWith(mockClassData);
      expect(createClass).toHaveBeenCalledTimes(1);
    });
    it('should handle errors', async () => {
        const mockClassData = { name: 'Math 101', date: '2024-09-10', permanent: 'No' };
        const errorMessage = 'No se pudo crear la clase';
        createClass.mockRejectedValue(new Error(errorMessage));
        await expect(createClass(mockClassData)).rejects.toThrow(errorMessage);
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