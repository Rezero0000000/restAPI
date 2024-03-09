import { ZodType } from "zod";

export class Validation {
    static validate <T> (scheme: ZodType, data: T): T {
        return scheme.parse(data);
    }
}