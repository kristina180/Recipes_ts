export const USER_URL = "https://api.escuelajs.co/api/v1/";

export interface IValuesSignup {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

export interface IValuesLogin {
  email: string;
  password: string;
}

class AuthStoreActions {
  public async getUsersAction() {
    const response = await fetch(`${USER_URL}users/`);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Failed to get users (status ${response.status}): ${text}`
      );
    }
    const data = await response.json();
    return data;
  }
  public async signupAction(values: IValuesSignup) {
    const response = await fetch(`${USER_URL}users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Signup failed (status ${response.status}): ${text}`);
    }

    const data = await response.json();
    return data;
  }

  public async loginAction(values: IValuesLogin) {
    const response = await fetch(`${USER_URL}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (response.status === 401) {
      throw new Error("Invalid email or password");
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Login failed (status ${response.status}): ${text}`);
    }

    const data = await response.json();

    return data;
  }

  public async checkAuthAction(token: string) {
    const response = await fetch(`${USER_URL}auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 401) {
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Check auth failed (status ${response.status}): ${text}`);
    }

    const data = await response.json();
    return data;
  }
}

export default new AuthStoreActions();
