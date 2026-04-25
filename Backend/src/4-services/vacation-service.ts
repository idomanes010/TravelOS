import { dal } from "../2-utils/dal";
import { VacationModel } from "../3-models/vacation-model";
import { fileSaver } from "uploaded-file-saver";
import { ResourceNotFoundError } from "../3-models/client-errors";
import { adminService } from "./admin-service";

class VacationService {

    public async getAllVacations(userId: number, page: number, filter: string): Promise<any[]> {

        const limit = 9;
        const offset = (page - 1) * limit;

        let filterCondition = "";

        // 🧠 filter logic
        if (filter === "active") {
            filterCondition = "WHERE startDate <= NOW() AND endDate >= NOW()";
        }

        else if (filter === "future") {
            filterCondition = "WHERE startDate > NOW()";
        }

        else if (filter === "liked") {
            filterCondition = `WHERE vacationId IN (
            SELECT vacationId FROM likes WHERE userId = ${userId}
        )`;
        }

        // 🔥 vacations עם pagination
        const vacationsSql = `
        SELECT * FROM vacations
        ${filterCondition}
        ORDER BY startDate
        LIMIT ${limit} OFFSET ${offset}
    `;

        const vacations = await dal.execute(vacationsSql) as VacationModel[];

        // likes count
        const likesCountSql = `
        SELECT vacationId, COUNT(*) as likesCount
        FROM likes
        GROUP BY vacationId
    `;

        const likesCountRows = await dal.execute(likesCountSql) as any[];

        // user likes
        const userLikesSql = "SELECT vacationId FROM likes WHERE userId = ?";
        const userLikesRows = await dal.execute(userLikesSql, [userId]) as any[];

        // maps
        const likesCountMap = new Map<number, number>();
        likesCountRows.forEach(row => {
            likesCountMap.set(row.vacationId, row.likesCount);
        });

        const userLikesSet = new Set<number>(
            userLikesRows.map(row => row.vacationId)
        );

        // merge
        const result = vacations.map(v => ({
            ...v,
            likesCount: likesCountMap.get(v.vacationId!) || 0,
            isLiked: userLikesSet.has(v.vacationId!)
        }));

        return result;
    }

    public async getVacationById(vacationId: number): Promise<VacationModel> {
        const sql = "select * from vacations where vacationId = ?";
        const values = [vacationId];
        const vacations = await dal.execute(sql, values) as VacationModel[];
        const vacation = vacations[0];
        if (!vacation) {
            throw new ResourceNotFoundError(vacationId);
        }

        return vacation;
    }

    public getImagePath(imageName: string): string {
        return fileSaver.getFilePath(imageName);
    }

}

export const vacationService = new VacationService();




































// public async getAllVacations(userId: number): Promise<any[]> {

//         // 1. bring all vacations
//         const vacationsSql = "select * from vacations order by startDate";
//         const vacations = await dal.execute(vacationsSql) as VacationModel[];

//         // 2. bring likes count per vacation
//         const likesCountSql = `
//         SELECT vacationId, COUNT(*) as likesCount
//         FROM likes
//         GROUP BY vacationId
//     `;
//         const likesCountRows = await dal.execute(likesCountSql) as any[];

//         // 3. bring all vacations liked by this user
//         const userLikesSql = "SELECT vacationId FROM likes WHERE userId = ?";
//         const userLikesRows = await dal.execute(userLikesSql, [userId]) as any[];

//         // 4. convert to maps
//         const likesCountMap = new Map<number, number>();
//         likesCountRows.forEach((row: any) => {
//             likesCountMap.set(row.vacationId, row.likesCount);
//         });

//         const userLikesSet = new Set<number>(
//             userLikesRows.map((row: any) => row.vacationId)
//         );

//         // 5. merge everything
//         const result = vacations.map(v => ({
//             ...v,
//             likesCount: likesCountMap.get(v.vacationId!) || 0,
//             isLikedByUser: userLikesSet.has(v.vacationId!)
//         }));

//         return result;
//     }