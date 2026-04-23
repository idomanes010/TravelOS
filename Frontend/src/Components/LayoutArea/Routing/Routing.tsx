import { Navigate, Route, Routes } from "react-router-dom";
import { Vacations } from "../../PagesArea/Vacations/Vacations";
import { Page404 } from "../../PagesArea/Page404/Page404";
import { Login } from "../../UserArea/Login/Login";
import { Register } from "../../UserArea/Register/Register";
import { AskAi } from "../../PagesArea/AskAi/AskAi";
import { AskMcp } from "../../PagesArea/AskMcp/AskMcp";
import { AddVacation } from "../../AdminArea/AddVacation/AddVacation";
import { UpdateVacation } from "../../AdminArea/UpdateVacation/UpdateVacation";
import { VacationReport } from "../../AdminArea/VacationReport/VacationReport";

export function Routing() {

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/Vacations" />} />
            <Route path="/Vacations" element={<Vacations />} />
            <Route path="/ask-ai" element={<AskAi />} />
            <Route path="/ask-mcp" element={<AskMcp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Page404 />} />

            <Route path="/admin/add" element={<AddVacation />} />
            <Route path="/admin/update/:id" element={<UpdateVacation />} />
            <Route path="/admin/report" element={<VacationReport />} />

        </Routes>
    );
}
