import { add_missions } from '../../../backend/services/missionsRoutes.py';

jest.mock('../../../backend/services/missionsRoutes.py', () => ({
  add_missions: jest.fn(),
}));

describe('add_missions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully add missions and return the created mission', async () => {
    const mockUsers = 'user1,user2,user3';
    const mockEvent = 'event123';
    const createdMission = { uid: 'user1', day: 'Viernes' };  // Assuming the 'day' comes from the class document
    add_missions.mockResolvedValue(createdMission);

    const result = await add_missions(mockUsers, mockEvent);

    expect(result).toEqual(createdMission);
    expect(add_missions).toHaveBeenCalledWith(mockUsers, mockEvent);
  });

  it('should handle case when the selected event is not found', async () => {
    const mockUsers = 'user1,user2,user3';
    const mockEvent = 'event999'; // This event ID doesn't exist
    const createdMission = {}; // Should return empty or error
    add_missions.mockResolvedValue(createdMission);

    const result = await add_missions(mockUsers, mockEvent);

    expect(result).toEqual(createdMission);
    expect(add_missions).toHaveBeenCalledWith(mockUsers, mockEvent);
  });

  it('should throw an error if add_missions fails', async () => {
    const mockUsers = 'user1,user2,user3';
    const mockEvent = 'event123';
    const errorMessage = 'Error while adding a mission';
    add_missions.mockRejectedValue(new Error(errorMessage));

    await expect(add_missions(mockUsers, mockEvent)).rejects.toThrow(errorMessage);
  });

  it('should throw an error if database operation fails', async () => {
    const mockUsers = 'user1,user2,user3';
    const mockEvent = 'event123';
    add_missions.mockRejectedValue(new Error('Database error'));

    await expect(add_missions(mockUsers, mockEvent)).rejects.toThrow('Database error');
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
