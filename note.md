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