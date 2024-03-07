import { PrismaClient } from "@prisma/client";
import {logger} from "./logging";

const prisma = new PrismaClient({
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
    loger.info(e)
  });

  prisma.$on("error", (e) => {
    loger.error(e)
  });

  prisma.$on("info", (e) => {
    loger.info(e)
  });

  prisma.$on("warn", (e) => {
    loger.warn(e)
  });