export default function<T>(data: T[], page: number, limit: number): T[] {
    page = page < 1 ? 1 : page;
    const start = (page - 1) * limit;
    const end = page * limit;
    return data.slice(start, end);
}