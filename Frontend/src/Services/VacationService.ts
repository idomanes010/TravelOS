import axios from "axios";
import { VacationModel } from "../Models/VacationModel";
import { appConfig } from "../Utils/AppConfig";
import { store } from "../Redux/Store";
import { vacationActions } from "../Redux/VacationSlice";
import { notify } from "../Utils/Notify";

class VacationService {

    public async getAllVacations(page: number, filter: string): Promise<void> {

        const response = await axios.get<VacationModel[]>(
            `${appConfig.vacationUrl}?page=${page}&filter=${filter}`
        );

        const vacations = response.data;

        store.dispatch(vacationActions.initVacations(vacations));
    }

    public async addVacation(vacation: VacationModel): Promise<void> {

        const myFormData = new FormData();
        myFormData.append("destination", vacation.destination!);
        myFormData.append("description", vacation.description!);
        myFormData.append("startDate", vacation.startDate!);
        myFormData.append("endDate", vacation.endDate!);
        myFormData.append("price", vacation.price?.toString()!);
        myFormData.append("image", vacation.image!);

        const response = await axios.post<VacationModel>(appConfig.adminAddVacationUrl, myFormData);
        const addedVacation = response.data;

        store.dispatch(vacationActions.addVacation(addedVacation));
    }


    public async updateVacation(vacation: VacationModel): Promise<void> {

        const myFormData = new FormData();
        myFormData.append("destination", vacation.destination ?? "");
        myFormData.append("description", vacation.description ?? "");
        myFormData.append("startDate", vacation.startDate ?? "");
        myFormData.append("endDate", vacation.endDate ?? "");
        myFormData.append("price", vacation.price?.toString() ?? "");

        if (vacation.image) {
            myFormData.append("image", vacation.image);
        }

        const response = await axios.put<VacationModel>(
            `${appConfig.adminUpdateVacationUrl}/${vacation.vacationId}`,
            myFormData
        );
        store.dispatch(vacationActions.updateVacation(response.data));
    }

    public async deleteVacation(id: number): Promise<void> {
        await axios.delete(`${appConfig.adminDeleteVacationUrl}/${id}`);
        store.dispatch(vacationActions.deleteVacation(id));
    }

    public async getVacationReport(): Promise<{ destination: string; likesCount: number }[]> {
        const response = await axios.get<{ destination: string; likesCount: number }[]>(appConfig.adminReportVacationUrl);
        return response.data;
    }

    public async getVacationReportCsv(): Promise<string> {
        const response = await axios.get<string>(appConfig.adminReportVacationUrlCsv);
        return response.data;
    }

    public async toggleLike(vacationId: number, isLiked: boolean): Promise<void> {

        store.dispatch(vacationActions.toggleLike(vacationId));

        try {
            if (isLiked) {
                await axios.delete(`${appConfig.likesUrl}/${vacationId}`);
            }
            else {
                await axios.post(appConfig.likesUrl, { vacationId });
            }
        }
        catch (err: any) {
            store.dispatch(vacationActions.toggleLike(vacationId));
            notify.error(err);
        }
    }
}

export const vacationService = new VacationService();












































