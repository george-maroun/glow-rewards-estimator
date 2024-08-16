-- CreateTable
CREATE TABLE "LocationData" (
    "id" SERIAL NOT NULL,
    "zipcode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "carbonCreditsPerMwh" DOUBLE PRECISION NOT NULL,
    "peakSunHours" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LocationData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LocationData_zipcode_key" ON "LocationData"("zipcode");

-- CreateIndex
CREATE INDEX "LocationData_zipcode_idx" ON "LocationData"("zipcode");
