import { AppState } from "../AppState";


export const selectFilteredVacations = (state: AppState) => {

    let vacations = state.vacations;
    const f = state.filter;

    if (f.search) {
        vacations = vacations.filter(v =>
            v.destination?.toLowerCase().includes(f.search.toLowerCase())
        );
    }

    if (f.onlyLiked) {
        vacations = vacations.filter(v => v.isLiked);
    }

    if (f.minPrice !== null) {
        vacations = vacations.filter(v => v.price! >= f.minPrice!);
    }

    if (f.maxPrice !== null) {
        vacations = vacations.filter(v => v.price! <= f.maxPrice!);
    }

    if (f.sortBy === "price") {
        vacations = [...vacations].sort((a, b) => a.price! - b.price!);
    } else {
        vacations = [...vacations].sort(
            (a, b) =>
                new Date(a.startDate!).getTime() -
                new Date(b.startDate!).getTime()
        );
    }

    return vacations;
};