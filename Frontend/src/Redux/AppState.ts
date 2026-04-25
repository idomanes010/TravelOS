import { UserModel } from "../Models/UserModel";
import { VacationModel } from "../Models/VacationModel";
import { FilterState } from "./FilterSlice";

export type AppState = {
    user: UserModel;
    vacations: VacationModel[];
    filter: FilterState;
};