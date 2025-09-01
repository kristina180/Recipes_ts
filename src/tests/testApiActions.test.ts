import AuthStoreActions, { USER_URL } from "../store/store-actions";

global.fetch = jest.fn();

const mockUser = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
  password: "123456",
  avatar: "",
  role: "customer",
};

const mockFetch = fetch as jest.Mock;

describe("AuthStoreActions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getUsersAction should return user list", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [mockUser],
    });

    const users = await AuthStoreActions.getUsersAction();
    expect(users).toEqual([mockUser]);
  });

  it("signupAction should send user data", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockUser,
    });

    const user = await AuthStoreActions.signupAction({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
      avatar: "",
    });

    expect(user).toEqual(mockUser);
  });

  it("loginAction should return tokens", async () => {
    const tokens = { access_token: "abc", refresh_token: "xyz" };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => tokens,
    });

    const result = await AuthStoreActions.loginAction({
      email: "test@example.com",
      password: "123456",
    });

    expect(result).toEqual(tokens);
  });

  it("checkAuthAction should return user if authorized", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockUser,
    });

    const result = await AuthStoreActions.checkAuthAction("valid-token");
    expect(result).toEqual(mockUser);
  });

  it("should throw error on unauthorized checkAuthAction", async () => {
    mockFetch.mockResolvedValue({
      status: 401,
      ok: false,
      text: async () => "Unauthorized",
    });

    await expect(
      AuthStoreActions.checkAuthAction("invalid-token")
    ).rejects.toThrow("Unauthorized");
  });
});
