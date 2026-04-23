import { useForm } from "react-hook-form";
import "./UpdateVacation.css";
import { VacationModel } from "../../../Models/VacationModel";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Role } from "../../../Models/RoleModel";
import { AppState } from "../../../Redux/AppState";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import { appConfig } from "../../../Utils/AppConfig";

export function UpdateVacation() {

    const { register, handleSubmit, setValue } = useForm<VacationModel>();
    const [preview, setPreview] = useState<string>("");

    const params = useParams();
    const navigate = useNavigate();

    const user = useSelector((state: AppState) => state.user);
    const vacations = useSelector((state: AppState) => state.vacations);

    const id = Number(params.id);

    function formatDate(date?: string) {
        if (!date) return "";
        return date.split("T")[0];
    }

    // admin guard
    useEffect(() => {
        if (!user || user.role !== Role.Admin) {
            notify.error("Only admins can access this page.");
            navigate("/vacations");
        }
    }, [user, navigate]);

    // load data + preview
    useEffect(() => {
        if (vacations.length === 0) return;
        const vacation = vacations.find(v => v.vacationId === id);
        if (!vacation) return;

        setValue("vacationId", vacation.vacationId);
        setValue("destination", vacation.destination);
        setValue("description", vacation.description);
        setValue("startDate", formatDate(vacation.startDate));
        setValue("endDate", formatDate(vacation.endDate));
        setValue("price", vacation.price);

        const imageUrl =
            vacation.imageName
                ? `${appConfig.vacationImgUrl}${vacation.imageName}`
                : vacation.imageUrl || "";

        setPreview(imageUrl);

    }, [vacations, id, setValue]);

    // image change handler
    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    }

    async function send(vacation: VacationModel) {
        try {

            if (vacation.price == null || vacation.price < 0) {
                notify.error("Price must be valid");
                return;
            }

            if (vacation.price > 10000) {
                notify.error("Price must be up to 10,000");
                return;
            }

            if (vacation.startDate && vacation.endDate && vacation.endDate < vacation.startDate) {
                notify.error("End date must be after start date");
                return;
            }

            const files = vacation.image as unknown as FileList;
            vacation.image = files?.[0];

            await vacationService.updateVacation(vacation);

            notify.success("Vacation updated!");
            navigate("/vacations");

        } catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="UpdateVacation">
            <form onSubmit={handleSubmit(send)}>

                <h2>Update Vacation</h2>

                <label>Destination:</label>
                <input type="text" {...register("destination")} required minLength={2} maxLength={100} />

                <label>Description:</label>
                <textarea {...register("description")} required minLength={2} maxLength={500} rows={4} />

                <label>Start Date:</label>
                <input type="date" {...register("startDate")} required />

                <label>End Date:</label>
                <input type="date" {...register("endDate")} required />

                <label>Price:</label>
                <input type="number" step="0.01" {...register("price")} />

                <label>Image:</label>
                <input type="file" {...register("image")} onChange={handleImageChange} />

                {preview && (
                    <div style={{ marginTop: "10px" }}>
                        <img src={preview} alt="preview" width="200" />
                    </div>
                )}

                <button>Update</button>

            </form>
        </div>
    );
}