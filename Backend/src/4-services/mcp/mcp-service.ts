import { dal } from "../../2-utils/dal";


class McpService {

    public async getAverageVacationPrice(): Promise<{ averagePrice: number }> {
        const sql = "SELECT AVG(price) AS averagePrice FROM vacations";
        const rows = await dal.execute(sql) as { averagePrice: number | null }[];
        return {
            averagePrice: rows[0]?.averagePrice ? Number(rows[0].averagePrice) : 0
        };
    }

    public async getActiveVacationsCount(): Promise<{ activeCount: number }> {
        const sql = `
        SELECT COUNT(*) AS activeCount
        FROM vacations
        WHERE startDate <= NOW() AND endDate >= NOW()
    `;
        const rows = await dal.execute(sql) as { activeCount: number }[];
        return {
            activeCount: Number(rows[0]?.activeCount || 0)
        };
    }

    public async getTopLikedVacations(limit: number = 10): Promise<any[]> {
        const sql = `
        SELECT 
            v.vacationId,
            v.destination,
            v.price,
            v.startDate,
            v.endDate,
            COUNT(l.vacationId) AS likesCount
        FROM vacations v
        LEFT JOIN likes l ON v.vacationId = l.vacationId
        GROUP BY v.vacationId
        ORDER BY likesCount DESC
        LIMIT ?
    `;
        const rows = await dal.execute(sql, [limit]) as any[];
        return rows;
    }

    public async getUpcomingVacations(limit: number = 5): Promise<any[]> {
        const sql = `
        SELECT 
            vacationId,
            destination,
            price,
            startDate,
            endDate
        FROM vacations
        WHERE startDate > NOW()
        ORDER BY startDate ASC
        LIMIT ?
    `;
        return await dal.execute(sql, [limit]) as any[];
    }

    public async getVacationsByBudget(maxPrice: number): Promise<any[]> {
        const sql = `
        SELECT 
            vacationId,
            destination,
            price,
            startDate,
            endDate
        FROM vacations
        WHERE price <= ?
        ORDER BY price ASC
    `;
        return await dal.execute(sql, [maxPrice]) as any[];
    }

    public async getVacationsByDateRange(startDate: string, endDate: string): Promise<any[]> {
        const sql = `
        SELECT 
            vacationId,
            destination,
            price,
            startDate,
            endDate
        FROM vacations
        WHERE startDate >= ? AND endDate <= ?
        ORDER BY startDate ASC
    `;
        return await dal.execute(sql, [startDate, endDate]) as any[];
    }
}

export const mcpService = new McpService();