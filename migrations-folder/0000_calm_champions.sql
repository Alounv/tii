CREATE TABLE IF NOT EXISTS "Objective" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"description" text NOT NULL,
	"duration" integer NOT NULL,
	"cost" integer NOT NULL,
	"coach" text NOT NULL,
	"motivation" text NOT NULL,
	"motivation_url" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "Success" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"objectiveId" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "User" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"avatar_url" text
);

DO $$ BEGIN
 ALTER TABLE Objective ADD CONSTRAINT Objective_userId_User_id_fk FOREIGN KEY ("userId") REFERENCES User("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE Success ADD CONSTRAINT Success_objectiveId_Objective_id_fk FOREIGN KEY ("objectiveId") REFERENCES Objective("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
