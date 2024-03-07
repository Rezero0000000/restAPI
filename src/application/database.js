"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'stdout',
            level: 'error',
        },
        {
            emit: 'stdout',
            level: 'info',
        },
        {
            emit: 'stdout',
            level: 'warn',
        },
    ],
});
prisma.$on("query", (e) => {
    loger.info(e);
});
prisma.$on("error", (e) => {
    loger.error(e);
});
prisma.$on("info", (e) => {
    loger.info(e);
});
prisma.$on("warn", (e) => {
    loger.warn(e);
});
