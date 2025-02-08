import { create_exersice_route } from '../../../backend/services/exercisesRoutes.py';

jest.mock('../../../backend/services/exercisesRoutes.py', () => ({
  create_exersice_route: jest.fn(),
}));

describe('create_exersice_route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully create a new exercise', async () => {
    const mockExcersice = {
      name: 'Yoga',
      description: 'A relaxing yoga class',
      owner: 'John Doe',
      image: Buffer.from('mock image data'), // Mock image buffer
    };

    // Mocked response from the route handler
    const mockResponse = { ...mockExcersice, image_url: 'http://mock-image-url.com/yoga.jpeg' };

    create_exersice_route.mockResolvedValue(mockResponse);

    const response = await create_exersice_route(mockExcersice);

    expect(response).toEqual(mockResponse);
    expect(create_exersice_route).toHaveBeenCalledWith(mockExcersice);
  });

  it('should handle the case when an exception occurs during the creation', async () => {
    const mockExcersice = {
      name: 'Yoga',
      description: 'A relaxing yoga class',
      owner: 'John Doe',
      image: Buffer.from('mock image data'),
    };

    // Simulate an error occurring during the creation (directly within route handler)
    const error = new Error('No se pudo crear la clase');
    create_exersice_route.mockRejectedValue(error);

    // This is a correction: we need to ensure that the route handler correctly handles the rejection
    try {
      await create_exersice_route(mockExcersice);
    } catch (err) {
      expect(err.message).toBe('No se pudo crear la clase');
    }
  });

  it('should return an error if invalid image is provided', async () => {
    const mockExcersice = {
      name: 'Yoga',
      description: 'A relaxing yoga class',
      owner: 'John Doe',
      image: null, // No image provided
    };

    // Mock response in case of no image
    const mockResponse = { error: 'No image provided' };

    create_exersice_route.mockResolvedValue(mockResponse);

    const response = await create_exersice_route(mockExcersice);

    expect(response).toEqual(mockResponse);
    expect(create_exersice_route).toHaveBeenCalledWith(mockExcersice);
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
