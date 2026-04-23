
export class VacationModel {
    public vacationId?: number;
    public destination?: string;
    public description?: string;
    public startDate?: string;
    public endDate?: string;
    public price?: number;
    public imageName?: string;
    public image?: File;
    public imageUrl?: string;
    public isLiked?: boolean;
    public likesCount?: number;
}
