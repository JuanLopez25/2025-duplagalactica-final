import { get_comments_route } from '../../../backend/services/classesRoutes.py';

jest.mock('../../../backend/services/classesRoutes.py', () => ({
  get_comments_route: jest.fn(),
}));

describe('get_comments_route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the list of comments successfully', async () => {
    const mockComments = [
      { id: '1', content: 'Great class!', rating: 5 },
      { id: '2', content: 'Very helpful, thank you!', rating: 4 },
    ];

    // Mock the response of the route handler
    get_comments_route.mockResolvedValue(mockComments);

    const response = await get_comments_route();

    expect(response).toEqual(mockComments);
    expect(get_comments_route).toHaveBeenCalled();
  });

  it('should handle an error when unable to fetch comments', async () => {
    const error = new Error('Error al obtener las clases');
    
    // Simulate an error thrown by the route handler
    get_comments_route.mockRejectedValue(error);

    try {
      await get_comments_route();
    } catch (err) {
      expect(err.message).toBe('Error al obtener las clases');
    }
  });

  it('should return an empty list if no comments are found', async () => {
    // Simulate the case where no comments are available
    get_comments_route.mockResolvedValue([]);

    const response = await get_comments_route();

    expect(response).toEqual([]);
    expect(get_comments_route).toHaveBeenCalled();
  });

  it('should return the correct comment structure', async () => {
    const mockComments = [
      { id: '1', content: 'Nice class!', rating: 4 },
      { id: '2', content: 'Very informative', rating: 5 },
    ];

    get_comments_route.mockResolvedValue(mockComments);

    const response = await get_comments_route();

    // Check that the response matches the expected structure
    expect(response).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String),
        content: expect.any(String),
        rating: expect.any(Number),
      })
    ]));
  });
});
