class AppConfig {

    public readonly registerUrl = "http://localhost:4001/api/register";
    public readonly loginUrl = "http://localhost:4001/api/login";

    public readonly vacationUrl = "http://localhost:4001/api/vacations";
    public readonly vacationImgUrl = "http://localhost:4001/api/vacations/images/";
    public readonly likesUrl = "http://localhost:4001/api/likes";
    
    public readonly gptUrl = "http://localhost:4001/api/ai";
    public readonly mcpUrl = "http://localhost:4001/api/ai/mcp";
    
    public readonly adminAddVacationUrl = "http://localhost:4001/api/admin/add";
    public readonly adminUpdateVacationUrl = "http://localhost:4001/api/admin/update";
    public readonly adminDeleteVacationUrl = "http://localhost:4001/api/admin/delete";
    public readonly adminReportVacationUrl = "http://localhost:4001/api/admin/report";
    public readonly adminReportVacationUrlCsv = "http://localhost:4001/api/admin/report/csv";
    

}

export const appConfig = new AppConfig();
