import { makeAutoObservable } from "mobx";
import { USER_URL } from "@/utils/constants";
import { it } from "node:test";

interface IUser {
  id: string;
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
      const checkEmail = await fetch(`${USER_URL}users/`);
      const data_checkEmail = await checkEmail.json();
      this.users = data_checkEmail;
    } catch (error: any) {
      console.log(error.message);
    }
  };

  signup = async (values: IValues) => {
    try {
      if (!this.users.find((elem: IUser) => elem.email == values.email)) {
        const response = await fetch(`${USER_URL}users/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        this.login({ email: data.email, password: data.password });
      } else {
        alert("The email is already registered");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  login = async (values: IValues) => {
    try {
      const response = await fetch(`${USER_URL}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if ("access_token" in data) {
        localStorage.setItem("access_token", data.access_token);
        document.cookie = `refresh_token=${data.refresh_token}; max-age=720`;
        this.checkAuth();
      }
      if (data.statusCode && data.statusCode == 401) {
        if (this.users.find((item) => item.email == values.email)) {
          alert("Invalid password");
        } else {
          alert("This user is not registered");
        }
      }
    } catch (error) {
      console.log("error 401");
    }
  };

  checkAuth = async () => {
    try {
      this.isLoading = true;
      const token = localStorage.getItem("access_token");
      if (token) {
        const login = await fetch(`${USER_URL}auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await login.json();

        if (data.statusCode && data.statusCode == 401) {
          this.isError = true;
        } else {
          this.user = data;
          this.isError = false;
        }
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
