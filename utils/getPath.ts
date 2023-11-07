// This component only works in Server Components
import { headers } from "next/headers";

export const getPath = () => {
    const headersList = headers();
    const path = headersList.get("x-pathname")
    return path
}