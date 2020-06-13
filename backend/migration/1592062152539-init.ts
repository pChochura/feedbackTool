import {MigrationInterface, QueryRunner} from "typeorm";

export class init1592062152539 implements MigrationInterface {
    name = 'init1592062152539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Note" ("id" character varying(16) NOT NULL, "content" character varying(512) NOT NULL, "positive" boolean NOT NULL, "listId" character varying(16), CONSTRAINT "PK_a677a8365a6131301c9c01254e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Room" ("id" character varying(16) NOT NULL, "sessionId" character varying(16) NOT NULL, "name" character varying(64) NOT NULL, "ready" boolean NOT NULL, CONSTRAINT "PK_867d589be92524f89375e2e086d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "List" ("id" character varying(16) NOT NULL, "name" character varying(64) NOT NULL, "roomId" character varying(16), CONSTRAINT "PK_1727d6c80966414bf9543429d58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Session" ("id" character varying(16) NOT NULL, "addLink" character varying(16) NOT NULL, "expirationTimestamp" integer NOT NULL, "phase" smallint NOT NULL DEFAULT 0, CONSTRAINT "PK_b2d57e0f3ce66780706d739e274" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "User" ("id" character varying(16) NOT NULL, "sessionId" character varying(16) NOT NULL, CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Room" ADD "ownNotes" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "Note" ADD CONSTRAINT "FK_b2c3a638b3d224c79718682e738" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "List" ADD CONSTRAINT "FK_99b7acca30d16c678d5462d810b" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "List" DROP CONSTRAINT "FK_99b7acca30d16c678d5462d810b"`);
        await queryRunner.query(`ALTER TABLE "Note" DROP CONSTRAINT "FK_b2c3a638b3d224c79718682e738"`);
        await queryRunner.query(`ALTER TABLE "Room" DROP COLUMN "ownNotes"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TABLE "Session"`);
        await queryRunner.query(`DROP TABLE "List"`);
        await queryRunner.query(`DROP TABLE "Room"`);
        await queryRunner.query(`DROP TABLE "Note"`);
    }

}
