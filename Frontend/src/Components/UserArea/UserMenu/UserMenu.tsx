import "./UserMenu.css";
import { userService } from "../../../Services/UserService";
import { NavLink, useNavigate } from "react-router-dom";
import { notify } from "../../../Utils/Notify";
import { AppState } from "../../../Redux/AppState";
import { useSelector } from "react-redux";

export function UserMenu() {

    const user = useSelector((state: AppState) => state.user);
    const navigate = useNavigate();

    function logout() {
        userService.logout();
        notify.success("Logged out successfully");
        navigate("/login");
    }

    return (
        <div className="UserMenu">
            {user && (
                <div className="login">
                    <span>Hello {user.firstName} {user.lastName}</span>
                    <button onClick={logout}>Logout</button>
                </div>
            )}

            {!user && (
                <div className="logged-out">
                    <span>Hello Guest | </span>
                    <NavLink to="/login">Login</NavLink>
                    <span> | </span>
                    <NavLink to="/register">Register</NavLink>
                </div>
            )}
        </div>
    );
}
































