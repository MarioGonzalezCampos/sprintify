
"use server";

import { createSesionClinet } from "@/lib/appwrite/appwrite";

export const getCurrent = async () => {

    try {
        const { account } = await createSesionClinet();

        return await account.get();

    } catch {
        return null;
    }
}