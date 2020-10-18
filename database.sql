CREATE TABLE "cohort" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(512)
);


-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(128) UNIQUE NOT NULL,
    "password" VARCHAR(1024) NOT NULL,
    "fullName" VARCHAR(1024) NOT NULL,
    "authLevel" VARCHAR(128) NOT NULL DEFAULT 'STUDENT',
    "cohortId" INT REFERENCES "cohort"
);

CREATE TABLE "question" (
	"id" SERIAL PRIMARY KEY,
	"title" VARCHAR(512),
	"details" VARCHAR(2048),
	"authorId" INT REFERENCES "user"
);

CREATE TABLE "answer" (
	"id" SERIAL PRIMARY KEY,
	"details" VARCHAR(2048),
	"authorId" INT REFERENCES "user",
	"questionId" INT REFERENCES "question",
	"isAccepted" BOOLEAN DEFAULT FALSE
);

CREATE TABLE "answerComment" (
	"id" SERIAL PRIMARY KEY,
	"details" VARCHAR(2048),
	"authorId" INT REFERENCES "user",
	"answerId" INT REFERENCES "answer"
);