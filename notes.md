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
- then supaya cepat dan g berulang validasinya kita bikin helper aja biar dinamis make typescript generic
```

import { ZodType } from "zod";

export class Validation {
    static validate <T> (scheme: ZodType, data: T): T {
        return scheme.parse(data);
    }
}

```
- baru kita validasi, cek duplikat, dan hash baru kita create data user
```

import { CreateUserRequest, UserResponse, toUserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { ResponseError } from "../error/response-error";
import { Validation } from "../validation/validation";
import { Prisma } from "../application/database";
import bcrypt from "bcrypt"

export class UserService {
    static async register (request: CreateUserRequest) :Promise<UserResponse> {

        // validation
        const registerRequest = Validation.validate(UserValidation.REGISTER,  request);

        // Check duplicate username with prisma
        const totalUserWithSameUsername = await Prisma.user.count({
            where: {
                username: registerRequest.username
            }
        })
        if (totalUserWithSameUsername != 0) {
            throw new ResponseError (400, "Username already exists")
        }

        // Hash password
        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        // Create user
        const user = await Prisma.user.create({
            data: registerRequest
        });

        // return UserResponse
        return toUserResponse(user);
    }
}

```

- Create custom error class
```

export class ResponseError extends Error {
    constructor(public status: number, public message: string) {
        super(message);
    }
}

```

- convert a data into spesific type (not type assertion)

```

export function toUserResponse (user: User) :UserResponse {
    return {
        name: user.name,
        username: user.username,
    }
}

```

- Create Router for public api and user
```

[public-api.ts]

import express from "express";
import { UserController } from "../controller/user-controller";


export const publicRouter = express.Router();
publicRouter.post("api/users", UserController.register);


```

- create controller 

```

import { NextFunction, Request, Response } from "express";
import { CreateUserRequest } from "../model/user-model";
import { UserService } from "../service/user-service";

export class UserController {
    static async register (req: Request, res: Response, next: NextFunction) {
        try {
            const request :CreateUserRequest = req.body as CreateUserRequest;
            const response = UserService.register(request);
            res.status(200).json({
                data: response
            }) 
        }
        catch (e) {
            next(e)
        }
    }
}

```