-- CreateTable
CREATE TABLE "InfoSection" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "reverse" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InfoSection_pkey" PRIMARY KEY ("id")
);
