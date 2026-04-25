import { OkPacketParams } from "mysql2/promise";
import { cyber } from "../2-utils/cyber";
import { dal } from "../2-utils/dal";
import { ValidationError } from "../3-models/client-errors";
import { UserModel } from "../3-models/user-model ";
import { Role } from "../3-models/enums ";
import { CredentialsModel } from "../3-models/credentials-mode";


class UserService {
    private async verifyFreeEmail(email: string): Promise<void> {
        const sql = "select * from users where email = ?";
        const values = [email];
        const users = await dal.execute(sql, values) as UserModel[];
        if (users.length > 0) throw new ValidationError("Email already in use");
    }

    public async register(user: UserModel): Promise<string> {

        // Validation:
        user.validate();
        await this.verifyFreeEmail(user.email);

        // Create sql:
        user.password = cyber.hash(user.password);
        user.role = Role.User;
        const sql = "insert into users(firstName, lastName, email, password, role) values(?, ?, ?, ?, ?)";
        const values = [user.firstName, user.lastName, user.email, user.password, user.role];

        // Execute: 
        const info: OkPacketParams = await dal.execute(sql, values) as OkPacketParams;
        user.userId = info.insertId!;

        // Generate token: 
        const token = cyber.generateToken(user);
        return token;
    }

    public async login(credentials: CredentialsModel): Promise<string> {
        credentials.validate();
        credentials.password = cyber.hash(credentials.password);
        const sql = "select * from users where email = ? and password = ?";
        const values = [credentials.email, credentials.password];
        const users = await dal.execute(sql, values) as UserModel[];
        const user = users[0];
        if (!user) throw new ValidationError("Incorrect email or password");
        const token = cyber.generateToken(user);
        return token;
    }
}

export const service = new UserService();










































// import { OkPacketParams } from "mysql2";
// import { dal } from "../2-utils/dal";
// import { cyber } from "../2-utils/cyber";
// import { appConfig } from "../2-utils/app-config";
// import axios from "axios";
// import { ResourceNotFoundError, UnauthorizedError, ValidationError } from "../3-models/client-errors";
// import { UserModel } from "../3-models/user-model ";
// import { Role } from "../3-models/enums ";
// import { CredentialsModel } from "../3-models/credentials-mode";

// class UserService {

//     // private async verifyCaptchaToken(captchaToken: string): Promise<void> {

//     //     // Create parameters to send to google:
//     //     const params = new URLSearchParams();
//     //     params.append("secret", appConfig.recaptchaSecretKey); // Secret key.
//     //     params.append("response", captchaToken); // The frontend captcha token (response from google)

//     //     // Ask google if user is a human or a bot:
//     //     const response = await axios.post(appConfig.recaptchaUrl, params);

//     //     // Get success:
//     //     const success = response.data.success; // true --> user is a human.

//     //     // If not a human:
//     //     if (!success) throw new ValidationError("You failed the ReCAPTCHA test.");
//     // }

//     private async verifyFreeEmail(email: string): Promise<void> {
//         const sql = "select * from users where email = ?";
//         const values = [email];
//         const users = await dal.execute(sql, values) as UserModel[];
//         if (users.length > 0) throw new ValidationError(`Email ${email} already taken.`);
//     }

//     public async register(user: UserModel): Promise<string> {

//         // Validation:
//         user.validate();
//         // this.verifyCaptchaToken(user.captchaToken);
//         // await this.verifyFreeEmail(user.email);

//         // Create sql:
//         user.password = cyber.hash(user.password);
//         user.roleId = Role.User;
//         const sql = "insert into users(firstName, lastName, email, password, roleId) values(?, ?, ?, ?, ?)";
//         const values = [user.firstName, user.lastName, user.email, user.password, user.roleId];

//         // Execute:
//         const info: OkPacketParams = await dal.execute(sql, values) as OkPacketParams;
//         user.id = info.insertId!;

//         // Generate token:
//         const token = cyber.generateToken(user);
//         return token;
//     }

//     // Login:
//     public async login(credentials: CredentialsModel): Promise<string> {

//         // Validate:
//         credentials.validate();

//         // Create sql:
//         credentials.password = cyber.hash(credentials.password);
//         const sql = "select * from users where email = ? and password = ?"; // Prepared Statement
//         const values = [credentials.email, credentials.password];

//         // Execute:
//         const users = await dal.execute(sql, values) as UserModel[];

//         // Extract user:
//         const user = users[0];

//         // If no such user:
//         if (!user) throw new UnauthorizedError("Incorrect email or password.");

//         // Generate token:
//         const token = cyber.generateToken(user);

//         // Return token:
//         return token;
//     }

//     public async getOneUser(id: number): Promise<UserModel> {

//         // Create sql:
//         const sql = "select * from users where id = ?";
//         const values = [id];

//         // Execute:
//         const users = await dal.execute(sql, values) as UserModel[];

//         // Extract user:
//         const user = users[0];

//         // If no such user:
//         if (!user) throw new ResourceNotFoundError(id);

//         // Remove password:
//         delete (user as any).password;

//         // Return user:
//         return user;
//     }

//     // get all users (admin use)
//     public async getAllUsers(): Promise<UserModel[]> {
//         const sql = "SELECT * FROM users";
//         const users = await dal.execute(sql) as UserModel[];

//         // remove passwords
//         users.forEach(u => delete (u as any).password);
//         return users;
//     }
// }

// export const userService = new UserService();

