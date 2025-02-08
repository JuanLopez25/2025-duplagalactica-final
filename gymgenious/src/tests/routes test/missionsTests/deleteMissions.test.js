import { delete_missions } from '../../../backend/services/missionsRoutes.py';

jest.mock('../../../backend/services/missionsRoutes.py', () => ({
  delete_missions: jest.fn(),
}));

describe('delete_missions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete missions and update user data', async () => {
    const mockMissions = ['mission1', 'mission2'];
    const mockUsers = ['user1', 'user2'];

    // Mock the delete and update actions
    delete_missions.mockResolvedValue(mockMissions);

    const result = await delete_missions(mockMissions);

    expect(result).toEqual(mockMissions);
    expect(delete_missions).toHaveBeenCalledWith(mockMissions);
  });

  it('should throw an error if delete_missions fails', async () => {
    const errorMessage = 'Error while deleting missions';
    delete_missions.mockRejectedValue(new Error(errorMessage));

    await expect(delete_missions()).rejects.toThrow(errorMessage);
  });

  it('should throw an error if database operation fails', async () => {
    delete_missions.mockRejectedValue(new Error('Database error'));

    await expect(delete_missions()).rejects.toThrow('Database error');
  });
});
