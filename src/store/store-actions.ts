export const USER_URL = "https://api.escuelajs.co/api/v1/";

interface IValues {
  name?: string;
  email: string;
  password: string;
  avatar?: string;
}

class AuthStoreActions {
  public async getUsersAction() {
    const response = await fetch(`${USER_URL}users/`);
    if (!response.ok) {
      throw new Error(`Problems with getting users`);
    }
    const data = await response.json();
    return data;
  }
  public async signupAction(values: IValues) {
    const response = await fetch(`${USER_URL}users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error(`Problems with sign up user`);
    }

    const data = await response.json();
    return data;
  }

  public async loginAction(values: IValues) {
    const response = await fetch(`${USER_URL}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok && response.status != 401) {
      throw new Error(`Problems with login user`);
    }

    const data = await response.json();

    return data;
  }

  public async checkAuthAction(token: string) {
    const response = await fetch(`${USER_URL}auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok && response.status != 401) {
      throw new Error(`Problems with checking auth user`);
    }

    const data = await response.json();
    return data;
  }
}

export default new AuthStoreActions();
