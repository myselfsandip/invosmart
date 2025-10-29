import { format } from "date-fns";


export function formatDate(
    date: string | Date,
    dateFormat: string = "dd MMM yyyy"
): string {
    try {
        return format(new Date(date), dateFormat);
    } catch (error) {
        console.error("Invalid date:", date, error);
        return "";
    }
}
