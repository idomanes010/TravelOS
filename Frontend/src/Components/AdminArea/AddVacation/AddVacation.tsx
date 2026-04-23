import { useForm } from "react-hook-form";
import "./AddVacation.css";
import { VacationModel } from "../../../Models/VacationModel";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Role } from "../../../Models/RoleModel";
import { notify } from "../../../Utils/Notify";
import { vacationService } from "../../../Services/VacationService";
import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/AppState";

export function AddVacation() {
    const { register, handleSubmit } = useForm<VacationModel>();
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const user = useSelector((state: AppState) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== Role.Admin) {
            notify.error("Only admins can access this page.");
            navigate("/vacations");
        }
    }, [user, navigate]);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const { onChange: onImageChange, ...imageRegisterRest } = register("image", {
        required: true
    });

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
        onImageChange(e);
    }

    async function send(vacation: VacationModel) {
        try {
            const files = vacation.image as unknown as FileList;
            vacation.image = files?.[0];

            const today = new Date().toISOString().split("T")[0];

            if (vacation.startDate! < today) {
                notify.error("Start date cannot be in the past.");
                return;
            }

            if (vacation.endDate! < vacation.startDate!) {
                notify.error("End date must be after start date.");
                return;
            }

            await vacationService.addVacation(vacation);
            notify.success("Vacation added!");
            navigate("/vacations");

        } catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="AddVacation">
            <form onSubmit={handleSubmit(send)}>
                <h2>Add Vacation</h2>

                <label>Destination:</label>
                <input type="text" {...register("destination")} required minLength={2} maxLength={100} />

                <label>Description:</label>
                <textarea {...register("description")} required minLength={2} maxLength={500} rows={4} />

                <label>Start Date:</label>
                <input type="date" {...register("startDate")} required />

                <label>End Date:</label>
                <input type="date" {...register("endDate")} required />

                <label>Price:</label>
                <input type="number" step="0.01" {...register("price")} required min={0} max={10000} />

                <label>Cover Image:</label>
                <label className="image-upload-box">
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} {...imageRegisterRest} required />
                    {previewUrl ? (
                        <div className="image-preview">
                            <img src={previewUrl} alt="Preview" />
                        </div>
                    ) : (
                        <div className="image-placeholder">
                            <span>Select Image</span>
                        </div>
                    )}
                </label>

                <button>Add Vacation</button>
            </form>
        </div>
    );
}