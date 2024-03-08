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
- npm install winston
- https://www.npmjs.com/package/winston 
-
- npm install bcrypt
- npm install --save-dev @types/bcrypt
- https://www.npmjs.com/package/bcrypt 
-
- npm install --save-dev jest @types/jest
- https://www.npmjs.com/package/jest 
- npm install --save-dev @babel/preset-typescript
- npm install --save-dev @jest/globals
- https://jestjs.io/docs/getting-started#using-typescript 

-
- npm install --save-dev babel-jest @babel/preset-env
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




setup db:
npx prisma init         (orm)
then setup scheme prisma and env

makin model
model user {
  username  String @id @db.VarChar(100)
  name      String @db.VarChar(100)
  password  String @db.VarChar(100)
  token     String @db.VarChar(100)

  @@map("user")
}


npx prisma migrate dev (for create new migration)