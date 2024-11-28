// This component only works in Server Components
import { headers, type UnsafeUnwrappedHeaders } from "next/headers";

export const getPath = () => {
    const headersList = (headers() as unknown as UnsafeUnwrappedHeaders);
    const path = headersList.get("x-pathname")
    return path
}