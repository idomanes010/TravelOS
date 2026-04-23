import { OkPacketParams } from "mysql2";
import { fileSaver } from "uploaded-file-saver";
import { dal } from "../2-utils/dal";
import { ResourceNotFoundError } from "../3-models/client-errors";
import { VacationModel } from "../3-models/vacation-model";

interface VacationReportRow {
    destination: string;
    likesCount: number;
}

class AdminService {
    private getImageUrl(imageName: string): string {
        return `http://localhost:4000/api/vacations/images/${imageName}`;
    }

    public async addVacation(vacation: VacationModel): Promise<VacationModel> {
        vacation.validate();
        const imageName = vacation.image ? await fileSaver.add(vacation.image) : vacation.imageName || null; // if there is image save it else save null.
        const sql = "insert into vacations(destination, description, startDate, endDate, price, imageName) values(?,?,?,?,?,?)";
        const values = [vacation.destination!, vacation.description!, vacation.startDate!, vacation.endDate!, vacation.price!, imageName!];
        const result = await dal.execute(sql, values) as OkPacketParams;
        vacation.vacationId = result.insertId;
        vacation.imageName = imageName || undefined;
        vacation.imageUrl = imageName ? this.getImageUrl(imageName) : undefined;
        return vacation;
    }

    public async updateVacation(vacation: VacationModel): Promise<VacationModel> {
        vacation.validate();
        const oldImageName = await this.getImageName(vacation.vacationId!);
        const newImageName = vacation.image
            ? await fileSaver.update(oldImageName || "", vacation.image)
            : vacation.imageName || oldImageName || null;
        const sql = "update vacations set destination = ?, description = ?, startDate = ?, endDate = ?, price = ?, imageName = ? where vacationId = ?";
        const values = [vacation.destination!, vacation.description!, vacation.startDate!,
        vacation.endDate!, vacation.price!, newImageName, vacation.vacationId!];
        const info: OkPacketParams = await dal.execute(sql, values) as OkPacketParams;

        // if no such vacation
        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(vacation.vacationId!);
        }
        vacation.imageName = newImageName || undefined;
        vacation.imageUrl = newImageName ? this.getImageUrl(newImageName) : undefined;
        return vacation;
    }

    public async deleteVacation(vacationId: number): Promise<void> {
        const oldImageName = await this.getImageName(vacationId);

        // First delete associated likes to respect foreign-key constraints
        const deleteLikesSql = "delete from likes where vacationId = ?";
        await dal.execute(deleteLikesSql, [vacationId]);
        const deleteVacationSql = "delete from vacations where vacationId = ?";
        const result = await dal.execute(deleteVacationSql, [vacationId]) as OkPacketParams;
        if (result.affectedRows === 0) throw new ResourceNotFoundError(vacationId);
        if (oldImageName) await fileSaver.delete(oldImageName);
    }

    public async getVacationReport(): Promise<VacationReportRow[]> {

        const sql = `
        SELECT v.destination, COUNT(l.userId) AS likesCount
        FROM vacations v
        LEFT JOIN likes l ON v.vacationId = l.vacationId
        GROUP BY v.vacationId, v.destination
    `;

        const result = await dal.execute(sql) as any[];
        return result.map(r => ({
            destination: r.destination,
            likesCount: Number(r.likesCount)
        }));
    }

    public async getVacationsReportCsv(): Promise<string> {
        const reportData = await adminService.getVacationReport();

        let csv = "Destination,Likes\n";

        for (const vacation of reportData) {
            const destination = `"${vacation.destination.replace(/"/g, '""')}"`;
            csv += `${destination},${vacation.likesCount}\n`;
        }

        return csv;
    }

    private async getImageName(id: number): Promise<string | null> {
        const sql = `select imageName from vacations where vacationId = ?`;
        const values = [id];
        const vacations = await dal.execute(sql, values) as VacationModel[];
        const vacation = vacations[0];
        if (!vacation) return null;
        return vacation.imageName!;
    }
}

export const adminService = new AdminService();
