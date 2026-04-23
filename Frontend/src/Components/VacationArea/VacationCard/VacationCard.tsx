import { useSelector } from "react-redux";
import "./VacationCard.css";
import { Role } from "../../../Models/RoleModel";
import { notify } from "../../../Utils/Notify";
import { appConfig } from "../../../Utils/AppConfig";
import { NavLink } from "react-router-dom";
import { VacationModel } from "../../../Models/VacationModel";
import { AppState } from "../../../Redux/AppState";
import { vacationService } from "../../../Services/VacationService";

interface VacationCardProps {
    vacation: VacationModel;
    onDeleted?: () => Promise<void> | void;
}

export function VacationCard(props: VacationCardProps) {

    const { vacation, onDeleted } = props;

    const user = useSelector((state: AppState) => state.user);
    const isAdmin = user?.role === Role.Admin;

    const startDate = new Date(vacation.startDate || "").toLocaleDateString("en-GB");
    const endDate = new Date(vacation.endDate || "").toLocaleDateString("en-GB");

    const imageUrl =
        (vacation.imageName ? `${appConfig.vacationImgUrl}${vacation.imageName}` : "") ||
        vacation.imageUrl ||
        "";

    async function toggleLike() {
        try {
            await vacationService.toggleLike(vacation.vacationId!, vacation.isLiked ?? false);
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    async function deleteVacation() {
        const confirmDelete = window.confirm("Are you sure you want to delete this vacation?");
        if (!confirmDelete) return;
        try {
            await vacationService.deleteVacation(vacation.vacationId!);
            await onDeleted?.();
            notify.success("Vacation deleted");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="VacationCard">

            <div className="card-image-container">
                <img src={imageUrl} alt={vacation.destination} />
                <span className="card-price">${vacation.price}</span>
            </div>

            <div className="card-content">
                <h3 className="card-destination">{vacation.destination}</h3>
                <span className="card-dates">🗓 {startDate} - {endDate}</span>
                <p className="card-description">{vacation.description}</p>

                {!isAdmin && (
                    <div className="like-section">
                        <button
                            className={`like-btn ${vacation.isLiked ? "liked" : ""}`}
                            onClick={toggleLike}
                        >
                            {vacation.isLiked ? "👍🏼" : "👎🏼"} {vacation.likesCount || 0}
                        </button>
                    </div>
                )}

                {isAdmin && (
                    <div className="admin-actions">
                        <NavLink to={`/admin/update/${vacation.vacationId}`} className="btn-edit">✏️ Edit</NavLink>
                        <button onClick={deleteVacation} className="btn-remove">🗑️ Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
}