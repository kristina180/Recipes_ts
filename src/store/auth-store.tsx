import { makeAutoObservable } from "mobx";

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
  user: IUser | undefined = undefined;
  users: IUser[] = [];
  isLoading: boolean = false;
  isError: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  getAllUsers = async () => {
    try {
      // const checkEmail = await fetch(`${USER_URL}users/`);
      // const data_checkEmail = await checkEmail.json();
      const rezult = await AuthStoreActions.getUsersAction();
      this.users = rezult;
    } catch (error: any) {
      console.log(error.message);
    }
  };

  signup = async (values: IValues) => {
    try {
      if (!this.users.find((elem: IUser) => elem.email == values.email)) {
        const rezult = await AuthStoreActions.signupAction(values);
        await this.getAllUsers();
        this.login({ email: rezult.email, password: rezult.password });
      } else {
        alert("The email is already registered");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  login = async (values: IValues) => {
    try {
      if (this.users.find((item) => item.email == values.email)) {
        const rezult = await AuthStoreActions.loginAction(values);
        console.log(rezult);
        if ("access_token" in rezult) {
          localStorage.setItem("access_token", rezult.access_token);
          document.cookie = `refresh_token=${rezult.refresh_token}; max-age=720`;
          this.checkAuth();
        } else {
          alert("Invalid password");
        }
      } else {
        alert("This user is not registered");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  checkAuth = async () => {
    try {
      this.isLoading = true;
      const token = localStorage.getItem("access_token");
      if (token) {
        // const login = await fetch(`${USER_URL}auth/profile`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // const data = await login.json();
        const data = await AuthStoreActions.checkAuthAction(token);

        this.user = data;
        this.isError = false;
      } else {
        this.isError = true;
      }
      this.isLoading = false;
    } catch (error: any) {
      console.log(error.message);
    }
  };
  toggleFormType = (value: "signup" | "login") => {
    this.formType = value;
  };

  logout = () => {
    localStorage.removeItem("access_token");
    localStorage.setItem("favorites", "");
    this.user = undefined;
  };
}
