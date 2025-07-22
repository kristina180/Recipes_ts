import AuthStoreAction from "../store/store-actions";
import { AuthStore } from "../store/auth-store";
import { error } from "console";
import { json } from "stream/consumers";
import { RequestErrorContext } from "next/dist/server/instrumentation/types";
import { FetchServerResponseResult } from "next/dist/client/components/router-reducer/fetch-server-response";

const mockUsers = [
  {
    id: 1,
    email: "john@mail.com",
    password: "changeme",
    name: "Jhon",
    role: "customer",
    avatar: "https://i.imgur.com/LDOO4Qs.jpg",
  },
  {
    id: 2,
    email: "mark@mail.com",
    password: "12345",
    name: "Mark",
    role: "customer",
    avatar: "https://i.imgur.com/LDOO4Qs.jpg",
  },
];

const mockResponseUsers = [
  {
    id: 1,
    email: "john@mail.com",
    password: "changeme",
    name: "Jhon",
    role: "customer",
    avatar: "https://i.imgur.com/LDOO4Qs.jpg",
  },
  {
    id: 2,
    email: "mark@mail.com",
    password: "12345",
    name: "Mark",
    role: "customer",
    avatar: "https://i.imgur.com/LDOO4Qs.jpg",
  },
];

const mockLoginResponse = {
  access_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY3Mjc2NjAyOCwiZXhwIjoxNjc0NDk0MDI4fQ.kCak9sLJr74frSRVQp0_27BY4iBCgQSmoT3vQVWKzJg",
  refresh_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY3Mjc2NjAyOCwiZXhwIjoxNjcyODAyMDI4fQ.P1_rB3hJ5afwiG4TWXLq6jOAcVJkvQZ2Z-ZZOnQ1dZw",
};

const mockLoginValues = {
  email: "john@mail.com",
  password: "changeme",
};

const mockCreateUser = {
  email: "john@mail.com",
  password: "changeme",
  name: "Jhon",
  avatar: "https://i.imgur.com/LDOO4Qs.jpg",
};

const mockSignUpNewUser = {
  email: "exampleuseremail@gmail.com",
  password: "12345",
  name: "Example",
  avatar: "https://i.imgur.com/LDOO4Qs.jpg",
};

const mockError = (fetch: string) => {
  return {
    error: "Not Found",
    message: `Cannot ${fetch} https://example.com`,
    statusCode: 404,
  };
};

const fetch_func = (datas) => {
  mockFetch.mockReturnValue(
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(datas),
      headers: new Headers(),
      redirected: false,
      status: 200,
      statusText: "OK",
      url: "https://example.com",
      type: "basic",
      body: null,
      bodyUsed: false,
    })
  );
};

const fetch_func_reject = (type_fetch: string) => {
  mockFetch.mockReturnValue(
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve(mockError(type_fetch)),
      bodyUsed: true,
      headers: new Headers(),
      redirected: false,
      status: 404,
      statusText: "",
      type: "cors",
      url: "https://example.com",
    })
  );
};

const mockFetch = jest.fn();
global.fetch = mockFetch;

const new_store = new AuthStore();

describe("Check getting users", () => {
  it("Test action for getting users", async () => {
    fetch_func(mockUsers);
    const result = await AuthStoreAction.getUsersAction();
    expect(mockFetch).toHaveBeenCalled();
    expect(result).toEqual(mockResponseUsers);
  });

  it("test adding users in users store", async () => {
    fetch_func(mockUsers);
    expect(new_store.users).toEqual([]);

    await new_store.getAllUsers();
    expect(new_store.users).toEqual(mockResponseUsers);
    expect(mockFetch).toHaveBeenCalled();
  });
  it("should throw error when response is not ok", async () => {
    fetch_func_reject("GET");
    try {
      await AuthStoreAction.getUsersAction();
    } catch (error: any) {
      expect(error.message).toEqual(`Problems with getting users`);
    }

    expect(mockFetch).toHaveBeenCalled();
  });

  it("should console.log error when response is not ok", async () => {
    fetch_func_reject("GET");
    const logSpy = jest.spyOn(console, "log");
    await new_store.getAllUsers();
    expect(mockFetch).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith("Problems with getting users");
  });
});

describe("Check sign up", () => {
  it("sign up action", async () => {
    fetch_func(mockUsers[0]);

    const rezult = await AuthStoreAction.signupAction(mockCreateUser);

    expect(mockFetch).toHaveBeenCalled();
    expect(rezult).not.toBeUndefined();
    expect(rezult).toEqual(mockResponseUsers[0]);
  });

  it("should throw error when response of sign up action is not ok", async () => {
    fetch_func_reject("POST");
    try {
      await AuthStoreAction.signupAction(mockCreateUser);
    } catch (error: any) {
      expect(error.message).toEqual(`Problems with sign up user`);
    }

    expect(mockFetch).toHaveBeenCalled();
  });

  it("sign up", async () => {
    const signSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    await new_store.signup(mockUsers[0]);

    expect(mockFetch).not.toHaveBeenCalled();
    expect(signSpy).toHaveBeenCalledWith("The email is already registered");
  });
  it("sign up", async () => {
    fetch_func(mockSignUpNewUser);

    const mock_login = jest.fn();
    new_store.login = (values) => mock_login(values);

    const signSpy = jest.spyOn(window, "alert");

    await new_store.signup(mockSignUpNewUser);

    expect(mockFetch).toHaveBeenCalled();
    expect(signSpy).not.toHaveBeenCalledWith("The email is already registered");
    expect(mock_login).toHaveBeenCalledWith({
      email: mockSignUpNewUser.email,
      password: mockSignUpNewUser.password,
    });
  });
});

describe("Check Log in", () => {
  it("test login action", async () => {
    fetch_func(mockLoginResponse);

    const response = await AuthStoreAction.loginAction(mockLoginValues);

    expect(response).not.toBeUndefined();
    expect(response.access_token).toBeDefined();
    expect(response.refresh_token).toBeDefined();
  });
});

describe("Check auth", () => {
  it("test check auth action", async () => {
    fetch_func(mockUsers[0]);
    const response = await AuthStoreAction.checkAuthAction(
      mockLoginResponse.access_token
    );
    expect(response).not.toBeUndefined();
    expect(response.id).toBe(1);
  });
});

test("toogle form type", () => {
  const test_state = new AuthStore();
  expect(test_state.formType).toBe("signup");
  test_state.toggleFormType("login");
  expect(test_state.formType).toBe("login");
});

test("log out", () => {
  const test_state = new AuthStore();
  test_state.user = mockUsers[0];
  expect(test_state.user).not.toBeUndefined();
  test_state.logout();
  expect(test_state.user).toBeUndefined();
});
