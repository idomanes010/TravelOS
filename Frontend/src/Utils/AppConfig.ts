class AppConfig {

    public readonly registerUrl = "http://localhost:4000/api/register";
    public readonly loginUrl = "http://localhost:4000/api/login";

    public readonly vacationUrl = "http://localhost:4000/api/vacations";
    public readonly vacationImgUrl = "http://localhost:4000/api/vacations/images/";
    public readonly likesUrl = "http://localhost:4000/api/likes";
    
    public readonly gptUrl = "http://localhost:4000/api/ai";
    public readonly mcpUrl = "http://localhost:4000/api/ai/mcp";
    
    public readonly adminAddVacationUrl = "http://localhost:4000/api/admin/add";
    public readonly adminUpdateVacationUrl = "http://localhost:4000/api/admin/update";
    public readonly adminDeleteVacationUrl = "http://localhost:4000/api/admin/delete";
    public readonly adminReportVacationUrl = "http://localhost:4000/api/admin/report";
    public readonly adminReportVacationUrlCsv = "http://localhost:4000/api/admin/report/csv";
    

}

export const appConfig = new AppConfig();
