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







































// class UserService {

//     public user: UserModel | null = null;

//     // Restore user from storage if exist:
//     public constructor() {
//         const token = localStorage.getItem("token");
//         if (token) {
//             this.handleToken(token);
//         }
//     }

//     private handleToken(token: string): void {
//         localStorage.setItem("token", token);
//         axios.defaults.headers.common["Authorization"] = "Bearer " + token;
//         const container = jwtDecode<{ user: UserModel }>(token);
//         const dbUser = container.user;
//         store.dispatch(userSlice.actions.initUser(dbUser));
//     }

//     // Register:
//     public async register(user: UserModel): Promise<void> {
//         const response = await axios.post<string>(appConfig.registerUrl, user);
//         const token = response.data;
//         this.handleToken(token);
//     }

//     // Login:
//     public async login(credentials: CredentialsModel): Promise<void> {
//         const response = await axios.post<string>(appConfig.loginUrl, credentials);
//         const token = response.data;
//         this.handleToken(token);
//     }

//     // Logout:
//     public logout(): void {
//         localStorage.removeItem("token");
//         delete axios.defaults.headers.common["Authorization"];
//         store.dispatch(userSlice.actions.logoutUser());
//     }
// }

// export const userService = new UserService();

// class UserService {

//     public user: UserModel | null = null;

//     private listeners: ((user: UserModel | null) => void)[] = [];

//     public connected(callback: (user: UserModel | null) => void): () => void {
//         this.listeners.push(callback);
//         return () => {
//             this.listeners = this.listeners.filter(l => l !== callback);
//         };
//     }

//     private notify(): void {
//         for (const listener of this.listeners) {
//             listener(this.user);
//         }
//     }

//     public constructor() {
//         const token = localStorage.getItem("token");
//         if (token) {
//             this.setUserFromToken(token);
//         }
//     }

//     private setUserFromToken(token: string): void {
//         localStorage.setItem("token", token);
//         const payload = jwtDecode<{ user: UserModel }>(token);
//         this.user = payload.user;
//         axios.defaults.headers.common["Authorization"] = "Bearer " + token;
//     }

//     public async register(user: UserModel): Promise<void> {
//         const response = await axios.post<string>(appConfig.registerUrl, user);
//         this.setUserFromToken(response.data);
//     }

//     public async login(credentials: CredentialsModel): Promise<void> {
//         const response = await axios.post<string>(appConfig.loginUrl, credentials);
//         this.setUserFromToken(response.data);
//         this.notify();
//     }

//     public logout(): void {
//         localStorage.removeItem("token");
//         this.user = null;
//         delete axios.defaults.headers.common["Authorization"];
//         this.notify();
//     }
// }

// export const userService = new UserService();
