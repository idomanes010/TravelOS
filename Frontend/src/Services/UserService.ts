import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { UserModel } from "../Models/UserModel";
import { appConfig } from "../Utils/AppConfig";
import { CredentialsModel } from "../Models/CredentialsModel";
import { store } from "../Redux/Store";
import { userSlice } from "../Redux/UserSlice";

class UserService {
    constructor() {
        axios.interceptors.response.use(
            response => response,
            error => {
                const statusCode = error?.response?.status;
                const hasToken = !!localStorage.getItem("token");

                if (statusCode === 401 && hasToken) {
                    this.logout();
                    if (!window.location.pathname.toLowerCase().includes("/login")) {
                        window.location.href = "/login";
                    }
                }

                return Promise.reject(error);
            }
        );

        const token = localStorage.getItem("token");
        if (token) {
            this.handleToken(token);
        }
    }

    private handleToken(token: string): void {
        const container = jwtDecode<any>(token);
        const expirationTime = container.exp ? container.exp * 1000 : 0;

        if (expirationTime && expirationTime <= Date.now()) {
            this.logout();
            return;
        }

        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const dbUser = container.user ?? container; // 👈 חשוב

        store.dispatch(userSlice.actions.initUser(dbUser));
    }

    public async login(credentials: CredentialsModel): Promise<void> {
        const response = await axios.post<string>(appConfig.loginUrl, credentials);
        this.handleToken(response.data);
    }

    public async register(user: UserModel): Promise<void> {
        const response = await axios.post<string>(appConfig.registerUrl, user);
        this.handleToken(response.data);
    }

    public logout(): void {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        store.dispatch(userSlice.actions.logoutUser());
    }
}

export const userService = new UserService();







































