-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_IndependentExpenditure" (
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
    "reportIdNumber" TEXT,
    "reportDate" TEXT,
    "reportFromDate" TEXT,
    "reportThruDate" TEXT,
    "filerId" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,

    FOREIGN KEY ("filerId") REFERENCES "Filer"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("agencyId") REFERENCES "MunicipalAgency"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);
INSERT INTO "new_IndependentExpenditure" ("id", "createdAt", "transactionId", "date", "amount", "description", "position", "ballotMeasureName", "ballotMeasureNumber", "candidateFirstName", "candidateLastName", "officeCode", "officeDescription", "jurisdiction", "district", "reportNumber", "reportIdNumber", "reportDate", "reportFromDate", "reportThruDate", "filerId", "agencyId") SELECT "id", "createdAt", "transactionId", "date", "amount", "description", "position", "ballotMeasureName", "ballotMeasureNumber", "candidateFirstName", "candidateLastName", "officeCode", "officeDescription", "jurisdiction", "district", "reportNumber", "reportIdNumber", "reportDate", "reportFromDate", "reportThruDate", "filerId", "agencyId" FROM "IndependentExpenditure";
DROP TABLE "IndependentExpenditure";
ALTER TABLE "new_IndependentExpenditure" RENAME TO "IndependentExpenditure";
CREATE UNIQUE INDEX "IndependentExpenditure.transactionId_unique" ON "IndependentExpenditure"("transactionId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
