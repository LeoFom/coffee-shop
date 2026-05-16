import {RootState} from "@/store/store";

export const getAccessToken = (state: RootState) => state?.products.items;
