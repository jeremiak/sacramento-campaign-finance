-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Filer" (
    "id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "committeeType" TEXT,
    PRIMARY KEY ("id")
);
INSERT INTO "new_Filer" ("id", "name", "committeeType") SELECT "id", "name", "committeeType" FROM "Filer";
DROP TABLE "Filer";
ALTER TABLE "new_Filer" RENAME TO "Filer";
CREATE TABLE "new_MunicipalAgency" (
    "id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "stringId" TEXT NOT NULL,
    "url" TEXT,
    PRIMARY KEY ("id")
);
INSERT INTO "new_MunicipalAgency" ("id", "name", "stringId", "url") SELECT "id", "name", "stringId", "url" FROM "MunicipalAgency";
DROP TABLE "MunicipalAgency";
ALTER TABLE "new_MunicipalAgency" RENAME TO "MunicipalAgency";
CREATE TABLE "new_ScheduleAContribution" (
    "id" TEXT NOT NULL,
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

    FOREIGN KEY ("filerId") REFERENCES "Filer"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("agencyId") REFERENCES "MunicipalAgency"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);
INSERT INTO "new_ScheduleAContribution" ("id", "createdAt", "transactionId", "date", "amount", "description", "contributorType", "contributorLastName", "contributorFirstName", "contributorAddress1", "contributorAddress2", "contributorCity", "contributorState", "contributorZip", "contributorOccupation", "contributorEmployer", "contributorSelfEmployed", "contributorCommitteeId", "reportNumber", "reportDate", "reportFromDate", "reportThruDate", "filerId", "agencyId") SELECT "id", "createdAt", "transactionId", "date", "amount", "description", "contributorType", "contributorLastName", "contributorFirstName", "contributorAddress1", "contributorAddress2", "contributorCity", "contributorState", "contributorZip", "contributorOccupation", "contributorEmployer", "contributorSelfEmployed", "contributorCommitteeId", "reportNumber", "reportDate", "reportFromDate", "reportThruDate", "filerId", "agencyId" FROM "ScheduleAContribution";
DROP TABLE "ScheduleAContribution";
ALTER TABLE "new_ScheduleAContribution" RENAME TO "ScheduleAContribution";
CREATE TABLE "new_ScheduleCContribution" (
    "id" TEXT NOT NULL,
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

    FOREIGN KEY ("filerId") REFERENCES "Filer"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("agencyId") REFERENCES "MunicipalAgency"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);
INSERT INTO "new_ScheduleCContribution" ("id", "transactionId", "date", "amount", "description", "contributorType", "contributorLastName", "contributorFirstName", "contributorAddress1", "contributorAddress2", "contributorCity", "contributorState", "contributorZip", "contributorOccupation", "contributorEmployer", "contributorSelfEmployed", "contributorCommitteeId", "reportNumber", "reportDate", "reportFromDate", "reportThruDate", "filerId", "agencyId") SELECT "id", "transactionId", "date", "amount", "description", "contributorType", "contributorLastName", "contributorFirstName", "contributorAddress1", "contributorAddress2", "contributorCity", "contributorState", "contributorZip", "contributorOccupation", "contributorEmployer", "contributorSelfEmployed", "contributorCommitteeId", "reportNumber", "reportDate", "reportFromDate", "reportThruDate", "filerId", "agencyId" FROM "ScheduleCContribution";
DROP TABLE "ScheduleCContribution";
ALTER TABLE "new_ScheduleCContribution" RENAME TO "ScheduleCContribution";
CREATE UNIQUE INDEX "ScheduleCContribution.transactionId_unique" ON "ScheduleCContribution"("transactionId");
CREATE TABLE "new_ScheduleEPayment" (
    "id" TEXT NOT NULL,
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

    FOREIGN KEY ("filerId") REFERENCES "Filer"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("agencyId") REFERENCES "MunicipalAgency"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);
INSERT INTO "new_ScheduleEPayment" ("id", "transactionId", "date", "amount", "description", "code", "payeeType", "payeeLastName", "payeeFirstName", "payeeAddress1", "payeeAddress2", "payeeCity", "payeeState", "payeeZip", "payeeCommitteeId", "reportNumber", "reportDate", "reportFromDate", "reportThruDate", "filerId", "agencyId") SELECT "id", "transactionId", "date", "amount", "description", "code", "payeeType", "payeeLastName", "payeeFirstName", "payeeAddress1", "payeeAddress2", "payeeCity", "payeeState", "payeeZip", "payeeCommitteeId", "reportNumber", "reportDate", "reportFromDate", "reportThruDate", "filerId", "agencyId" FROM "ScheduleEPayment";
DROP TABLE "ScheduleEPayment";
ALTER TABLE "new_ScheduleEPayment" RENAME TO "ScheduleEPayment";
CREATE UNIQUE INDEX "ScheduleEPayment.transactionId_unique" ON "ScheduleEPayment"("transactionId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
