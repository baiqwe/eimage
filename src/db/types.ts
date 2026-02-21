import { apikey, user } from "./auth.schema";
import { userFiles } from "./app.schema";

export type User = typeof user.$inferSelect;
export type ApiKey = typeof apikey.$inferSelect;
export type UserFiles = typeof userFiles.$inferSelect;