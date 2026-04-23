import jwt, { SignOptions } from "jsonwebtoken";
import { appConfig } from "./app-config";
import crypto from "crypto";
import { Request } from "express";
import { UserModel } from "../3-models/user-model ";
import { Role } from "../3-models/enums ";


class Cyber {

    public hash(plainText: string): string {
        const hashText = crypto
            .createHmac("sha512", appConfig.hashSalt)
            .update(plainText)
            .digest("hex");
        return hashText;
    }

    public generateToken(user: UserModel): string {
        delete (user as any).password;
        const payload = { user };
        const options: SignOptions = { expiresIn: "3h" };
        const token = jwt.sign(payload, appConfig.jwtSecret as string, options);
        return token;
    }

    // extract token
    public extractToken(request: Request): string | null {
        const auth = request.headers.authorization;
        if (!auth?.startsWith("Bearer ")) return null;
        return auth.split(" ")[1];
    }

    // verify token (THROWS if invalid)
    public verifyToken(token: string): any {
        return jwt.verify(token, appConfig.jwtSecret as string);
    }

    // get full user from token (SAFE)
    public getUserFromToken(token: string): UserModel {
        const payload = jwt.verify(token, appConfig.jwtSecret as string) as { user: UserModel };
        return payload.user;
    }

    // get user id
    public getUserId(token: string): number {
        const user = this.getUserFromToken(token);
        return user.userId;
    }

    // check admin
    public isAdmin(token: string): boolean {
        const user = this.getUserFromToken(token);
        return user.role === Role.Admin;
    }

    public getTokenUserId(token: string): number {
        try {
            const payload = jwt.decode(token) as { user: UserModel };
            const user = payload.user;
            return Number(user.userId);
        }
        catch {
            return 0;
        }
    }
}

export const cyber = new Cyber();