import { useForm } from "react-hook-form";
import "./Register.css";
import { UserModel } from "../../../Models/UserModel";
import { NavLink, useNavigate } from "react-router-dom";
import { notify } from "../../../Utils/Notify";
import { userService } from "../../../Services/UserService";

export function Register() {

    const { register, handleSubmit } = useForm<UserModel>();
    const navigate = useNavigate();

    async function send(user: UserModel) {
        try {
            await userService.register(user);
            notify.success(`Welcome ${user.firstName} ${user.lastName}!`);
            navigate("/Vacations");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="Register">
            <form onSubmit={handleSubmit(send)}>
                <h2>Register</h2>

                <label>First Name:</label>
                <input type="text" {...register("firstName")} required minLength={2} maxLength={30} />

                <label>Last Name:</label>
                <input type="text" {...register("lastName")} required minLength={2} maxLength={30} />

                <label>Email:</label>
                <input type="email" {...register("email")} required />

                <label>Password:</label>
                <input type="password" {...register("password")} required minLength={4} maxLength={30} />

                <button>Register</button>

                <p>Already have an account? <NavLink to="/login">Click to Login</NavLink></p>
            </form>
        </div>
    );
}
