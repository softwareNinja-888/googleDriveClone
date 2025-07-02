-- CreateTable
CREATE TABLE "Folder" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploadTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "folderId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Folder_name_key" ON "Folder"("name");

-- CreateIndex
CREATE UNIQUE INDEX "File_id_key" ON "File"("id");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
