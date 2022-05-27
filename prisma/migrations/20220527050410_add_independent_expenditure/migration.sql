-- CreateTable
CREATE TABLE "IndependentExpenditure" (
    "id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT,
    "position" TEXT NOT NULL,
    "ballotMeasureName" TEXT,
    "ballotMeasureNumber" TEXT,
    "candidateFirstName" TEXT,
    "candidateLastName" TEXT,
    "officeCode" TEXT,
    "officeDescription" TEXT,
    "jurisdiction" TEXT,
    "district" TEXT,
    "reportNumber" INTEGER,
    "reportIdNumber" INTEGER,
    "reportDate" TEXT,
    "reportFromDate" TEXT,
    "reportThruDate" TEXT,
    "filerId" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,

    FOREIGN KEY ("filerId") REFERENCES "Filer"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("agencyId") REFERENCES "MunicipalAgency"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IndependentExpenditure.transactionId_unique" ON "IndependentExpenditure"("transactionId");
