-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "intro" TIMESTAMP(3) NOT NULL,
    "disc" TIMESTAMP(3),
    "category" TEXT NOT NULL,
    "titles" TEXT[],
    "imgs" TEXT[],
    "family" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "cpus" TEXT[],
    "ram" TEXT NOT NULL,
    "vram" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "optical" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
