import { AuthStore } from "../store/auth-store";
import AuthStoreActions from "../store/store-actions";

jest.mock("../store/store-actions");

const mockUser = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
  password: "123456",
  avatar: "",
  role: "customer",
};

const mockedAuthActions = AuthStoreActions as jest.Mocked<
  typeof AuthStoreActions
>;

describe("AuthStore", () => {
  let store: AuthStore;

  beforeEach(() => {
    store = new AuthStore();
    jest.clearAllMocks();
    mockedAuthActions.getUsersAction.mockResolvedValue([mockUser]);
  });

  it("should toggle form type", () => {
    store.toggleFormType("login");
    expect(store.formType).toBe("login");
  });

  it("should register new user and auto login", async () => {
    mockedAuthActions.signupAction.mockResolvedValue(mockUser);
    mockedAuthActions.loginAction.mockResolvedValue({
      access_token: "access",
      refresh_token: "refresh",
    });
    mockedAuthActions.checkAuthAction.mockResolvedValue(mockUser);

    await store.signup({
      name: "Test User",
      email: "new@example.com",
      password: "pass123",
      avatar: "",
    });

    expect(store.user).toEqual(mockUser);
    expect(store.isError).toBe(false);
  });

  it("should not register already existing user", async () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    await store.signup({
      name: "Test User",
      email: mockUser.email,
      password: "pass123",
      avatar: "",
    });

    expect(alertMock).toHaveBeenCalledWith("The email is already registered");
    alertMock.mockRestore();
  });

  it("should login existing user", async () => {
    mockedAuthActions.loginAction.mockResolvedValue({
      access_token: "access",
      refresh_token: "refresh",
    });
    mockedAuthActions.checkAuthAction.mockResolvedValue(mockUser);

    await store.login({ email: mockUser.email, password: "123456" });

    expect(store.user).toEqual(mockUser);
  });

  it("should show alert for unregistered user on login", async () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    mockedAuthActions.getUsersAction.mockResolvedValue([]);

    await store.login({ email: "unknown@example.com", password: "123456" });

    expect(alertMock).toHaveBeenCalledWith("This user is not registered");
    alertMock.mockRestore();
  });

  it("should logout user", () => {
    localStorage.setItem("access_token", "token");
    store.user = mockUser;

    store.logout();

    expect(store.user).toBeNull();
    expect(localStorage.getItem("access_token")).toBeNull();
  });

  it("should check auth with token", async () => {
    localStorage.setItem("access_token", "token");
    mockedAuthActions.checkAuthAction.mockResolvedValue(mockUser);

    await store.checkAuth();

    expect(store.user).toEqual(mockUser);
  });

  it("should reset user if token is invalid", async () => {
    localStorage.setItem("access_token", "token");
    mockedAuthActions.checkAuthAction.mockRejectedValue(
      new Error("Unauthorized")
    );

    await store.checkAuth();

    expect(store.user).toBeNull();
  });
});
