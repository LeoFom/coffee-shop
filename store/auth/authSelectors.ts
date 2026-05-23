import {RootState} from "@/store/store";

export const getIsAuthenticated = (state: RootState) => state?.auth.isAuthenticated;
