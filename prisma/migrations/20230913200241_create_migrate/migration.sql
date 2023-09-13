-- CreateTable
CREATE TABLE "User" (
    "_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "isInDiet" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
