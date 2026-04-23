import "./Menu.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/AppState";
import { Role } from "../../../Models/RoleModel";


export function Menu() {

    const user = useSelector((state: AppState) => state.user);
    const isAdmin = user?.role === Role.Admin;

    return (
        <nav className="Menu">

            <NavLink to="/vacations">Vacations</NavLink>
            <span> | </span>
            <NavLink to="/ask-ai">Ask AI</NavLink>
            <span> | </span>
            <NavLink to="/ask-mcp">Ask MCP</NavLink>

            {isAdmin && (
                <>
                    <span> | </span>
                    <NavLink to="/admin/add">Add Vacation</NavLink>
                    <span> | </span>
                    {isAdmin && (
                        <NavLink to="/admin/report">📊 Report</NavLink>
                    )}
                </>
            )}

        </nav>
    );
}





































// export function Menu() {
//     return (
//         <div className="Menu">
//             <NavLink to="/Vacations">Vacations</NavLink>
//             <span> | </span>
//             <NavLink to="/ask-ai">Ask-AI</NavLink>
//             <span> | </span>
//             <NavLink to="/ask-mcp">Ask-MCP</NavLink>

//             {user?.Role === "Admin" && (
//                 <NavLink to="/admin/add">Add Vacation</NavLink>
//             )}
//         </div>
//     );
// }
