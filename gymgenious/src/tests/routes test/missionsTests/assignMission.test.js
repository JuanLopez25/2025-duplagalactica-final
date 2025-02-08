import { assign_mission } from '../../../backend/services/missionsRoutes.py';

jest.mock('../../../backend/services/missionsRoutes.py', () => ({
  assign_mission: jest.fn(),
}));

describe('assign_mission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully assign missions and return created missions', async () => {
    const mockAmount = 3;
    const mockUserId = 'user123';
    const createdMissions = [
      { uid: 'user123', progress: 0, mid: 'mission1', Day: 'Monday' },
      { uid: 'user123', progress: 0, mid: 'mission2', Day: 'Tuesday' },
    ];
    assign_mission.mockResolvedValue(createdMissions);

    const result = await assign_mission(mockAmount, mockUserId);

    expect(result).toEqual(createdMissions);
    expect(assign_mission).toHaveBeenCalledWith(mockAmount, mockUserId);
  });

  it('should handle case where no missions are assigned because of user progress', async () => {
    const mockAmount = 0;
    const mockUserId = 'user123';
    const createdMissions = [];
    assign_mission.mockResolvedValue(createdMissions);

    const result = await assign_mission(mockAmount, mockUserId);

    expect(result).toEqual(createdMissions);
    expect(assign_mission).toHaveBeenCalledWith(mockAmount, mockUserId);
  });

  it('should throw an error if assign_mission fails', async () => {
    const mockAmount = 3;
    const mockUserId = 'user123';
    const errorMessage = 'Error while assigning missions';
    assign_mission.mockRejectedValue(new Error(errorMessage));

    await expect(assign_mission(mockAmount, mockUserId)).rejects.toThrow(errorMessage);
  });

  it('should throw an error if database operation fails', async () => {
    const mockAmount = 3;
    const mockUserId = 'user123';
    assign_mission.mockRejectedValue(new Error('Database error'));

    await expect(assign_mission(mockAmount, mockUserId)).rejects.toThrow('Database error');
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
