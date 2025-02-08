import { get_missions_progress } from '../../../backend/services/missionsRoutes.py';

jest.mock('../../../backend/services/missionsRoutes.py', () => ({
  get_missions_progress: jest.fn(),
}));

describe('get_missions_progress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve the progress of missions', async () => {
    const mockMissionProgress = [
      { idMission: 'mission1', progress: 50 },
      { idMission: 'mission2', progress: 75 }
    ];

    // Mock the successful return of mission progress data
    get_missions_progress.mockResolvedValue(mockMissionProgress);

    const result = await get_missions_progress();

    expect(result).toEqual(mockMissionProgress);
    expect(get_missions_progress).toHaveBeenCalled();
  });

  it('should throw an error if retrieving missions progress fails', async () => {
    const errorMessage = 'Error while getting the progress of missions';
    get_missions_progress.mockRejectedValue(new Error(errorMessage));

    await expect(get_missions_progress()).rejects.toThrow(errorMessage);
  });

  it('should handle general exceptions and throw an error', async () => {
    get_missions_progress.mockRejectedValue(new Error('Database error'));

    await expect(get_missions_progress()).rejects.toThrow('Database error');
  });
});
