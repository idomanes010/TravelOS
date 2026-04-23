import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FilterState = {
    search: string;
    onlyLiked: boolean;
    sortBy: "price" | "date";
    minPrice: number | null;
    maxPrice: number | null;
};

const initialState: FilterState = {
    search: "",
    onlyLiked: false,
    sortBy: "date",
    minPrice: null,
    maxPrice: null
};

function setSearch(state: FilterState, action: PayloadAction<string>) {
    state.search = action.payload;
}

function toggleOnlyLiked(state: FilterState) {
    state.onlyLiked = !state.onlyLiked;
}

function setSortBy(state: FilterState, action: PayloadAction<"price" | "date">) {
    state.sortBy = action.payload;
}

function setMinPrice(state: FilterState, action: PayloadAction<number | null>) {
    state.minPrice = action.payload;
}

function setMaxPrice(state: FilterState, action: PayloadAction<number | null>) {
    state.maxPrice = action.payload;
}

function resetFilters() {
    return initialState;
}

export const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        setSearch,
        toggleOnlyLiked,
        setSortBy,
        setMinPrice,
        setMaxPrice,
        resetFilters
    }
});

export const filterActions = filterSlice.actions;