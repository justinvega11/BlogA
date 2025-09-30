
import fs from "fs";
import os from "os";
import path from "path";

export function readConfigUrl() {
    const configFileName = ".gatorconfig.json";
    const homeDir = os.homedir();
    const fullPath = path.join(homeDir, configFileName);

    const data = fs.readFileSync(fullPath, "utf-8");
    const rawConfig = JSON.parse(data);

    if (!rawConfig.db_url) throw new Error("Missing databaseUrl in .gatorconfig.json");

    return rawConfig.db_url;
}