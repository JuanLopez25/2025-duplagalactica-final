import { get_unique_user_membership } from '../../../backend/services/membershipsRoutes.py';

jest.mock('../../../backend/services/membershipsRoutes.py', () => ({
  get_unique_user_membership: jest.fn(),
}));

describe('get_unique_user_membership', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get memberships successfully', async () => {
    // Mock response from the database
    const mockMemberships = [
      { id: '1', user: 'user1@example.com', membershipType: 'Premium' },
      { id: '2', user: 'user2@example.com', membershipType: 'Standard' }
    ];

    get_unique_user_membership.mockResolvedValue(mockMemberships);

    const result = await get_unique_user_membership();

    expect(result).toEqual(mockMemberships);
    expect(get_unique_user_membership).toHaveBeenCalled();
  });

  it('should throw an error if there is an issue fetching the memberships', async () => {
    // Simulate an error in fetching the memberships
    get_unique_user_membership.mockRejectedValue(new Error('No existen usuarios con ese mail'));

    await expect(get_unique_user_membership()).rejects.toThrow('No existen usuarios con ese mail');
  });
});
