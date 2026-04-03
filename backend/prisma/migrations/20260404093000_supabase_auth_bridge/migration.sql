ALTER TABLE "User"
ADD COLUMN "supabaseUserId" TEXT,
ALTER COLUMN "passwordHash" DROP NOT NULL;

CREATE UNIQUE INDEX "User_supabaseUserId_key" ON "User"("supabaseUserId");
