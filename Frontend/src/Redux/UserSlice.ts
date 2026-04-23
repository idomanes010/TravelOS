import { Action, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "../Models/UserModel";


function initUser(_currentState: UserModel, action: PayloadAction<UserModel>): UserModel {
    return action.payload;
}

function logoutUser(_currentState: UserModel, _action: Action): UserModel {
    return null!;
}

export const userSlice = createSlice({
    name: "user-slice",
    initialState: null! as UserModel,
    reducers: { initUser, logoutUser }
});

export const userActions = userSlice.actions;