# Belajar membuat restAPI menggunakan typescript dan express js

### Install Library yang di perlukan
- npm install zod   ( For validation scheme )
-
- npm install express ( For backend )
- npm install --save-dev @types/express
- https://www.npmjs.com/package/express   (Documentation)
-
- npm install --save-dev prisma ( ORM )
- https://www.prisma.io/  (Documentation)
-
- npm install winston (Logger)
- https://www.npmjs.com/package/winston 
-
- npm install bcrypt
- npm install --save-dev @types/bcrypt
- https://www.npmjs.com/package/bcrypt 
-
- npm install --save-dev jest @types/jest ( Unit testing )
- https://www.npmjs.com/package/jest 
- npm install --save-dev @babel/preset-typescript
- npm install --save-dev @jest/globals
- https://jestjs.io/docs/getting-started#using-typescript 

-
- npm install --save-dev babel-jest @babel/preset-env ( js module compiler )
- https://babeljs.io/setup#installation 
-
- npm install --save-dev supertest @types/supertest
- https://www.npmjs.com/package/supertest 
-
- npm install --save-dev typescript
- https://www.npmjs.com/package/typescript
- npx tsc --init
- Semua konfigurasi akan dibuat di file tsconfig.json
- Ubah “module” menjadi “commonjs” 
- Ubah "moduleResolution" menjadi "Node"
- Tambahkan include src/**/*
- Ubah outDir menjadi “./dist”

<br>
<br>
<br>

### Setup Database:
- npx prisma init         (orm)
- then setup scheme prisma and env (check on prisma documentation website)
- create a model
``` 

model user {
  username  String @id @db.VarChar(100)
  name      String @db.VarChar(100)
  password  String @db.VarChar(100)
  token     String @db.VarChar(100)
  contacts  Contact[]                   // Relationship field

  @@map("user")
}

model Contact {
  id         Int     @id @default(autoincrement())
  first_name String  @db.VarChar(100)
  last_name  String? @db.VarChar(100)
  email      String? @db.VarChar(100)
  phone      String? @db.VarChar(20)
  username   String  @db.VarChar(100)

  user       User   @relation(fields: [username], references: [username])   // Relationship field
  address Address[]
  @@map("contacts")
}

```
- npx prisma migrate dev (for create new migration)

<br>

### Setup project

#### Prisma & Prisma log

```
  import { PrismaClient } from "@prisma/client";
  import {logger} from "./logging";

  export const prisma = new PrismaClient({
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

    prisma.$on("query", (e) => {
      logger.info(e)
    });

    prisma.$on("error", (e) => {
      logger.error(e)
    });

    prisma.$on("info", (e) => {
      logger.info(e)
    });

    prisma.$on("warn", (e) => {
      logger.warn(e)
    });

  ```

### Winston
```
  import winston from "winston";

  export const logger = winston.createLogger({
      level: "debug",
      format: winston.format.json(),
      transports: [
          new winston.transports.Console({})
      ]
  })

```

### Express

```

import express from "express"

export const web = express();
web.use(express.json());

```


### Register user API

- Making type for response and request on user-model.ts
- create UserService class then create the register method (don't forget to use the user models type and asyncrhonous)
- ### then we're gonna Setup the validation :v
- okay here's how to create a validation scheme 
```

import { z, ZodType } from "zod";

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        name: z.string().min(1).max(100),
        username: z.string().min(1).max(100),
        password: z.string().min(1).max(100),
    })
}

```
