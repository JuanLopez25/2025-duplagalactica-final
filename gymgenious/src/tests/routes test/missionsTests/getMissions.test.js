import { get_missions } from '../../../backend/services/missionsRoutes.py';

jest.mock('../../../backend/services/missionsRoutes.py', () => ({
  get_missions: jest.fn(),
}));

describe('get_missions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of missions', async () => {
    const mockMissions = [
      { id: 'mission1', uid: 'user1', progress: 0, mid: 'template1', Day: 'Monday' },
      { id: 'mission2', uid: 'user2', progress: 0, mid: 'template2', Day: 'Tuesday' },
    ];
    get_missions.mockResolvedValue(mockMissions);

    const result = await get_missions();

    expect(result).toEqual(mockMissions);
    expect(get_missions).toHaveBeenCalled();
  });

  it('should throw an error if get_missions fails', async () => {
    const errorMessage = 'Error while getting missions';
    get_missions.mockRejectedValue(new Error(errorMessage));

    await expect(get_missions()).rejects.toThrow(errorMessage);
  });

  it('should throw an error if database operation fails', async () => {
    get_missions.mockRejectedValue(new Error('Database error'));

    await expect(get_missions()).rejects.toThrow('Database error');
  });
});
