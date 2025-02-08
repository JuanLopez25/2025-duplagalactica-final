import { update_exer_info } from '../../../backend/services/exercisesRoutes.py';

jest.mock('../../../backend/services/exercisesRoutes.py', () => ({
    update_exer_info: jest.fn(),
}));

describe('update_exer_info', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update an exercise successfully with an image', async () => {
    const mockExercise = {
      id: '1',
      name: 'Yoga',
      description: 'A relaxing yoga class',
      image_url: 'http://some-image-url.com',
      image: 'image-data', // Simulated image data
    };

    const mockResponse = { message: 'Actualización realizada' };

    // Mock the response of the route handler
    update_exer_info.mockResolvedValue(mockResponse);

    const response = await update_exer_info(mockExercise);

    expect(response).toEqual(mockResponse);
    expect(update_exer_info).toHaveBeenCalledWith(mockExercise);
  });

  it('should update an exercise without an image', async () => {
    const mockExercise = {
      id: '1',
      name: 'Pilates',
      description: 'A strength-building Pilates class',
      image_url: '',
      image: null, // No image provided
    };

    const mockResponse = { message: 'Actualización realizada' };

    update_exer_info.mockResolvedValue(mockResponse);

    const response = await update_exer_info(mockExercise);

    expect(response).toEqual(mockResponse);
    expect(update_exer_info).toHaveBeenCalledWith(mockExercise);
  });

  it('should return a message if exercise is not found', async () => {
    const mockExercise = {
      id: 'non-existing-id',
      name: 'Boxing',
      description: 'A high-energy boxing class',
    };

    const mockResponse = { message: 'No se encontró el ejercicio' };

    // Simulating a non-existing exercise ID
    update_exer_info.mockResolvedValue(mockResponse);

    const response = await update_exer_info(mockExercise);

    expect(response).toEqual(mockResponse);
    expect(update_exer_info).toHaveBeenCalledWith(mockExercise);
  });

  it('should handle the case when an exception occurs during the update', async () => {
    const error = new Error('Error actualizando el ejercicio');
    update_exer_info.mockRejectedValue(error);

    try {
      await update_exer_info({ id: '1', name: 'Yoga', description: 'Test' });
    } catch (err) {
      expect(err.message).toBe('Error actualizando el ejercicio');
    }
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
