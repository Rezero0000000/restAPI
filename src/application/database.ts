import { PrismaClient } from "@prisma/client";
import {logger} from "./logging";

export const Prisma = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
  });

  Prisma.$on("query", (e) => {
    logger.info(e)
  });

  Prisma.$on("error", (e) => {
    logger.error(e)
  });

  Prisma.$on("info", (e) => {
    logger.info(e)
  });

  Prisma.$on("warn", (e) => {
    logger.warn(e)
  });