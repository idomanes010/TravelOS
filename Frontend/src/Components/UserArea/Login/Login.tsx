import { useForm } from "react-hook-form";
import "./Login.css";
import { CredentialsModel } from "../../../Models/CredentialsModel";
import { NavLink, useNavigate } from "react-router-dom";
import { userService } from "../../../Services/UserService";
import { notify } from "../../../Utils/Notify";
import { Role } from "../../../Models/RoleModel";
import { jwtDecode } from "jwt-decode";

export function Login() {

    const { register, handleSubmit } = useForm<CredentialsModel>();
    const navigate = useNavigate();
    async function send(credentials: CredentialsModel) {
        try {
            await userService.login(credentials);
            const token = localStorage.getItem("token");
            const decoded = token ? jwtDecode<any>(token) : null;
            const loggedInUser = decoded?.user ?? decoded;

            if (loggedInUser?.role === Role.Admin) {
                notify.success("welcome back Admin");
            }
            else {
                notify.success("Welcome back fellow travelers!");
            }
            navigate("/Vacations");
        } catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit(send)}>

                <label>Email: </label>
                <input type="email" {...register("email")} required />

                <label>Password: </label>
                <input type="password" {...register("password")} required minLength={4} maxLength={30} />

                <button>Login</button>

                <p>Don't have an account? <NavLink to="/register">Click to Register</NavLink></p>
            </form>
        </div>
    );
}
































