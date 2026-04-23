import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./AppState";
import { userSlice } from "./UserSlice";
import { vacationSlice } from "./VacationSlice";
// import { likeSlice } from "./LikeSlice";
import { filterSlice } from "./FilterSlice";


export const store = configureStore<AppState>({
    reducer: {
        user: userSlice.reducer,
        vacations: vacationSlice.reducer,
        // like: likeSlice.reducer,
        filter: filterSlice.reducer
    }
});