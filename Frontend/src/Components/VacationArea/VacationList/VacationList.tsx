import "./VacationList.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notify } from "../../../Utils/Notify";
import { vacationService } from "../../../Services/VacationService";
import { VacationCard } from "../VacationCard/VacationCard";
import { AppState } from "../../../Redux/AppState";
import { Spinner } from "../../SharedArea/Spinner/Spinner";
import { Role } from "../../../Models/RoleModel";

export function VacationList() {

    const vacations = useSelector((state: AppState) => state.vacations);
    const user = useSelector((state: AppState) => state.user);
    const isAdmin = user?.role === Role.Admin;

    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState("all");
    const [refreshKey, setRefreshKey] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        if (isAdmin && filter === "liked") {
            setFilter("all");
            setPage(1);
        }
    }, [isAdmin, filter]);

    useEffect(() => {

        if (!user) {
            notify.error("You must be logged in to view vacations.");
            navigate("/login");
            return;
        }

        setLoading(true);

        vacationService.getAllVacations(page, filter)
            .then(() => setLoading(false))
            .catch(err => {
                notify.error(err);
                setLoading(false);
            });

    }, [user, page, filter, navigate, refreshKey]);

    function refreshAfterDelete(): void {
        setRefreshKey(prev => prev + 1);
    }

    return (
        <div className="VacationListPage">

            <div className="filter-bar">
                <button onClick={() => { setFilter("all"); setPage(1); }}>All vacations</button>
                {!isAdmin && (
                    <button onClick={() => { setFilter("liked"); setPage(1); }}>Liked vacations</button>
                )}
                <button onClick={() => { setFilter("active"); setPage(1); }}>Active</button>
                <button onClick={() => { setFilter("future"); setPage(1); }}>Not Started</button>
            </div>

            <div className="VacationList">
                {loading && <Spinner />}

                {!loading && vacations.length === 0 && (
                    <p>No vacations found.</p>
                )}

                {vacations.map(v => (
                    <VacationCard
                        key={v.vacationId}
                        vacation={v}
                        onDeleted={refreshAfterDelete}
                    />
                ))}
            </div>

            {!loading && vacations.length > 0 && (
                <div className="pagination">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>◀ Prev</button>
                    <span>Page {page}</span>
                    <button disabled={vacations.length < 9} onClick={() => setPage(p => p + 1)}>Next ▶</button>
                </div>
            )}

        </div>
    );
}