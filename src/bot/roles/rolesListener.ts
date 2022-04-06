import {inject, injectable} from "tsyringe";
import {Client} from "discord.js";
import * as fs from "fs";


@injectable()
export class RolesListener {

    private readonly rolesPath = "./config/roles/"


    constructor(@inject("discordClient") private readonly client: Client) {
        fs.readdirSync(this.rolesPath).forEach(file => {
            const roleContent = fs.readFileSync(`${this.rolesPath}${file}`, "utf8");


        });
    }

    public findeMac(macAddressen: string[], gesucht: string): boolean {
        let gefunden: boolean = false;
        for (let i = 0; i < macAddressen.length && !gefunden; i++) {
            if (macAddressen[i] === gesucht) {
                gefunden = true;
            }
        }
        return gefunden;
    }
}
