-- CreateTable
CREATE TABLE "LateContribution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionId" TEXT,
    "date" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "contributorType" TEXT NOT NULL,
    "contributorCommitteeId" TEXT,
    "contributorLastName" TEXT NOT NULL,
    "contributorFirstName" TEXT NOT NULL,
    "contributorAddress1" TEXT,
    "contributorAddress2" TEXT,
    "contributorCity" TEXT,
    "contributorState" TEXT,
    "contributorZip" TEXT,
    "contributorOccupation" TEXT,
    "contributorEmployer" TEXT,
    "contributorSelfEmployed" BOOLEAN,
    "reportNumber" INTEGER,
    "reportDate" TEXT,
    "reportFromDate" TEXT,
    "reportThruDate" TEXT,
    "filerId" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    CONSTRAINT "LateContribution_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "MunicipalAgency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LateContribution_filerId_fkey" FOREIGN KEY ("filerId") REFERENCES "Filer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_IndependentExpenditure" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    CONSTRAINT "IndependentExpenditure_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "MunicipalAgency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "IndependentExpenditure_filerId_fkey" FOREIGN KEY ("filerId") REFERENCES "Filer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_IndependentExpenditure" ("agencyId", "amount", "ballotMeasureName", "ballotMeasureNumber", "candidateFirstName", "candidateLastName", "createdAt", "date", "description", "district", "filerId", "id", "jurisdiction", "officeCode", "officeDescription", "position", "reportDate", "reportFromDate", "reportIdNumber", "reportNumber", "reportThruDate", "transactionId") SELECT "agencyId", "amount", "ballotMeasureName", "ballotMeasureNumber", "candidateFirstName", "candidateLastName", "createdAt", "date", "description", "district", "filerId", "id", "jurisdiction", "officeCode", "officeDescription", "position", "reportDate", "reportFromDate", "reportIdNumber", "reportNumber", "reportThruDate", "transactionId" FROM "IndependentExpenditure";
DROP TABLE "IndependentExpenditure";
ALTER TABLE "new_IndependentExpenditure" RENAME TO "IndependentExpenditure";
CREATE UNIQUE INDEX "IndependentExpenditure_transactionId_key" ON "IndependentExpenditure"("transactionId");
CREATE TABLE "new_ScheduleEPayment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "payeeType" TEXT NOT NULL,
    "payeeLastName" TEXT NOT NULL,
    "payeeFirstName" TEXT,
    "payeeAddress1" TEXT,
    "payeeAddress2" TEXT,
    "payeeCity" TEXT,
    "payeeState" TEXT,
    "payeeZip" TEXT,
    "payeeCommitteeId" TEXT,
    "reportNumber" INTEGER,
    "reportDate" TEXT,
    "reportFromDate" TEXT,
    "reportThruDate" TEXT,
    "filerId" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    CONSTRAINT "ScheduleEPayment_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "MunicipalAgency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ScheduleEPayment_filerId_fkey" FOREIGN KEY ("filerId") REFERENCES "Filer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ScheduleEPayment" ("agencyId", "amount", "code", "createdAt", "date", "description", "filerId", "id", "payeeAddress1", "payeeAddress2", "payeeCity", "payeeCommitteeId", "payeeFirstName", "payeeLastName", "payeeState", "payeeType", "payeeZip", "reportDate", "reportFromDate", "reportNumber", "reportThruDate", "transactionId") SELECT "agencyId", "amount", "code", "createdAt", "date", "description", "filerId", "id", "payeeAddress1", "payeeAddress2", "payeeCity", "payeeCommitteeId", "payeeFirstName", "payeeLastName", "payeeState", "payeeType", "payeeZip", "reportDate", "reportFromDate", "reportNumber", "reportThruDate", "transactionId" FROM "ScheduleEPayment";
DROP TABLE "ScheduleEPayment";
ALTER TABLE "new_ScheduleEPayment" RENAME TO "ScheduleEPayment";
CREATE UNIQUE INDEX "ScheduleEPayment_transactionId_key" ON "ScheduleEPayment"("transactionId");
CREATE TABLE "new_ScheduleCContribution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "contributorType" TEXT NOT NULL,
    "contributorCommitteeId" TEXT,
    "contributorLastName" TEXT NOT NULL,
    "contributorFirstName" TEXT NOT NULL,
    "contributorAddress1" TEXT,
    "contributorAddress2" TEXT,
    "contributorCity" TEXT,
    "contributorState" TEXT,
    "contributorZip" TEXT,
    "contributorOccupation" TEXT,
    "contributorEmployer" TEXT,
    "contributorSelfEmployed" BOOLEAN,
    "reportNumber" INTEGER,
    "reportDate" TEXT,
    "reportFromDate" TEXT,
    "reportThruDate" TEXT,
    "filerId" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    CONSTRAINT "ScheduleCContribution_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "MunicipalAgency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ScheduleCContribution_filerId_fkey" FOREIGN KEY ("filerId") REFERENCES "Filer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ScheduleCContribution" ("agencyId", "amount", "contributorAddress1", "contributorAddress2", "contributorCity", "contributorCommitteeId", "contributorEmployer", "contributorFirstName", "contributorLastName", "contributorOccupation", "contributorSelfEmployed", "contributorState", "contributorType", "contributorZip", "createdAt", "date", "description", "filerId", "id", "reportDate", "reportFromDate", "reportNumber", "reportThruDate", "transactionId") SELECT "agencyId", "amount", "contributorAddress1", "contributorAddress2", "contributorCity", "contributorCommitteeId", "contributorEmployer", "contributorFirstName", "contributorLastName", "contributorOccupation", "contributorSelfEmployed", "contributorState", "contributorType", "contributorZip", "createdAt", "date", "description", "filerId", "id", "reportDate", "reportFromDate", "reportNumber", "reportThruDate", "transactionId" FROM "ScheduleCContribution";
DROP TABLE "ScheduleCContribution";
ALTER TABLE "new_ScheduleCContribution" RENAME TO "ScheduleCContribution";
CREATE UNIQUE INDEX "ScheduleCContribution_transactionId_key" ON "ScheduleCContribution"("transactionId");
CREATE TABLE "new_ScheduleAContribution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionId" TEXT,
    "date" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "contributorType" TEXT NOT NULL,
    "contributorCommitteeId" TEXT,
    "contributorLastName" TEXT NOT NULL,
    "contributorFirstName" TEXT NOT NULL,
    "contributorAddress1" TEXT,
    "contributorAddress2" TEXT,
    "contributorCity" TEXT,
    "contributorState" TEXT,
    "contributorZip" TEXT,
    "contributorOccupation" TEXT,
    "contributorEmployer" TEXT,
    "contributorSelfEmployed" BOOLEAN,
    "reportNumber" INTEGER,
    "reportDate" TEXT,
    "reportFromDate" TEXT,
    "reportThruDate" TEXT,
    "filerId" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    CONSTRAINT "ScheduleAContribution_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "MunicipalAgency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ScheduleAContribution_filerId_fkey" FOREIGN KEY ("filerId") REFERENCES "Filer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ScheduleAContribution" ("agencyId", "amount", "contributorAddress1", "contributorAddress2", "contributorCity", "contributorCommitteeId", "contributorEmployer", "contributorFirstName", "contributorLastName", "contributorOccupation", "contributorSelfEmployed", "contributorState", "contributorType", "contributorZip", "createdAt", "date", "description", "filerId", "id", "reportDate", "reportFromDate", "reportNumber", "reportThruDate", "transactionId") SELECT "agencyId", "amount", "contributorAddress1", "contributorAddress2", "contributorCity", "contributorCommitteeId", "contributorEmployer", "contributorFirstName", "contributorLastName", "contributorOccupation", "contributorSelfEmployed", "contributorState", "contributorType", "contributorZip", "createdAt", "date", "description", "filerId", "id", "reportDate", "reportFromDate", "reportNumber", "reportThruDate", "transactionId" FROM "ScheduleAContribution";
DROP TABLE "ScheduleAContribution";
ALTER TABLE "new_ScheduleAContribution" RENAME TO "ScheduleAContribution";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
