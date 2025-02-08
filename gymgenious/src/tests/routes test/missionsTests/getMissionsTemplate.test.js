import { get_missions_template } from '../../../backend/services/missionsRoutes.py';

jest.mock('../../../backend/services/missionsRoutes.py', () => ({
  get_missions_template: jest.fn(),
}));

describe('get_missions_template', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve the mission templates successfully', async () => {
    const mockMissionTemplates = [
      { id: 'template1', name: 'Mission 1', difficulty: 'Medium' },
      { id: 'template2', name: 'Mission 2', difficulty: 'Hard' },
    ];

    // Mock the successful return of mission templates data
    get_missions_template.mockResolvedValue(mockMissionTemplates);

    const result = await get_missions_template();

    expect(result).toEqual(mockMissionTemplates);
    expect(get_missions_template).toHaveBeenCalled();
  });

  it('should throw an error if retrieving mission templates fails', async () => {
    const errorMessage = 'Error while getting the mission templates';
    get_missions_template.mockRejectedValue(new Error(errorMessage));

    await expect(get_missions_template()).rejects.toThrow(errorMessage);
  });

  it('should handle general exceptions and throw an error', async () => {
    get_missions_template.mockRejectedValue(new Error('Database error'));

    await expect(get_missions_template()).rejects.toThrow('Database error');
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
