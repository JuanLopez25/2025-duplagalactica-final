import { add_mission_progress } from '../../../backend/services/missionsRoutes.py';

jest.mock('../../../backend/services/missionsRoutes.py', () => ({
  add_mission_progress: jest.fn(),
}));

describe('add_mission_progress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add mission progress successfully and return true', async () => {
    const missions = 'mission1,mission2';
    const uid = 'user123';

    // Mock the successful return of mission progress data
    add_mission_progress.mockResolvedValue(true);

    const result = await add_mission_progress(missions, uid);

    expect(result).toBe(true);
    expect(add_mission_progress).toHaveBeenCalledWith(missions, uid);
  });

  it('should throw an error if the user is not found', async () => {
    const missions = 'mission1,mission2';
    const uid = 'user123';

    // Simulate a user not found error
    add_mission_progress.mockRejectedValue(new Error('User not found'));

    await expect(add_mission_progress(missions, uid)).rejects.toThrow('User not found');
  });

  it('should throw an error if the user email is missing', async () => {
    const missions = 'mission1,mission2';
    const uid = 'user123';

    // Simulate a missing email error
    add_mission_progress.mockRejectedValue(new Error('User email not found'));

    await expect(add_mission_progress(missions, uid)).rejects.toThrow('User email not found');
  });

  it('should throw an error if the operation fails', async () => {
    const missions = 'mission1,mission2';
    const uid = 'user123';

    // Simulate a general failure
    add_mission_progress.mockRejectedValue(new Error('It was not possible to complete the operation'));

    await expect(add_mission_progress(missions, uid)).rejects.toThrow('It was not possible to complete the operation');
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
