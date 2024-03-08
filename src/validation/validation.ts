import { ZodType } from "zod";

export class Validation {
    static validation <T> (scheme: ZodType, data: T): ZodType<T> {
        return scheme.parse(data);
    }
}