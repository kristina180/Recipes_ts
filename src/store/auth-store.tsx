import { makeAutoObservable } from "mobx";
import { IValuesLogin, IValuesSignup } from "./store-actions";

import AuthStoreActions from "./store-actions";

interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: string;
}

interface IValues {
  name?: string;
  email: string;
  password: string;
  avatar?: string;
}

export const USER_URL = "https://api.escuelajs.co/api/v1/";

export class AuthStore {
  formType: "signup" | "login" = "signup";
  user: IUser | null = null;
  users: IUser[] = [];
  isLoading: boolean = false;
  isError: boolean = false;
  errorMessage: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  private setLoading = (state: boolean) => {
    this.isLoading = state;
  };

  private setError = (message: string) => {
    this.isError = true;
    this.errorMessage = message;
    console.error(message);
  };

  private clearError = () => {
    this.isError = false;
    this.errorMessage = "";
  };

  private isEmailRegistred = (email: string): boolean => {
    return this.users.some((user) => user.email == email);
  };

  private storeToken = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("access_token", accessToken);
    document.cookie = `refresh_token=${refreshToken}; max-age=720`;
  };

  getAllUsers = async (): Promise<void> => {
    try {
      const result = await AuthStoreActions.getUsersAction();
      this.users = result;
    } catch (error: any) {
      this.setError(error.message || "Failed to fetch users");
    }
  };

  signup = async (values: IValuesSignup): Promise<void> => {
    this.setLoading(true);
    this.clearError();

    try {
      await this.getAllUsers();

      if (this.isEmailRegistred(values.email)) {
        alert("The email is already registered");
        return;
      }

      const result = await AuthStoreActions.signupAction(values);
      await this.login({ email: result.email, password: result.password });
    } catch (error: any) {
      this.setError(error.message || "Signup failed.");
    } finally {
      this.setLoading(false);
    }
  };

  login = async (values: IValuesLogin): Promise<void> => {
    this.setLoading(true);
    this.clearError();
    try {
      await this.getAllUsers();

      if (!this.isEmailRegistred(values.email)) {
        alert("This user is not registered");
        return;
      }

      const result = await AuthStoreActions.loginAction(values);

      if ("access_token" in result && result.access_token) {
        this.storeToken(result.access_token, result.refresh_token);
        await this.checkAuth();
      }
    } catch (error: any) {
      if (error.message === "Invalid email or password") {
        alert("Invalid email or password");
      } else {
        this.setError(error.message || "Login failed");
      }
    } finally {
      this.setLoading(false);
    }
  };

  checkAuth = async (): Promise<void> => {
    this.setLoading(true);
    this.clearError();

    const token = localStorage.getItem("access_token");
    if (!token) {
      this.setLoading(false);
      this.user = null;
      return;
    }
    try {
      const useData = await AuthStoreActions.checkAuthAction(token);
      this.user = useData;
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        this.user = null;
      } else {
        this.setError(error.message || "Check auth failed");
      }
    } finally {
      this.setLoading(false);
    }
  };
  toggleFormType = (value: "signup" | "login") => {
    this.formType = value;
  };

  logout = () => {
    localStorage.removeItem("access_token");
    localStorage.setItem("favorites", "");
    document.cookie = "refresh_token=; Max-Age=0";
    this.user = null;
  };
}
