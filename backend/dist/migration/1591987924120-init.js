'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.init1591987924120 = void 0;
class init1591987924120 {
	constructor() {
		this.name = 'init1591987924120';
	}
	async up(queryRunner) {
		await queryRunner.query(
			`CREATE TABLE "Session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_b2d57e0f3ce66780706d739e274" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "Note" ("id" character varying(16) NOT NULL, "content" character varying(512) NOT NULL, CONSTRAINT "PK_a677a8365a6131301c9c01254e9" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "List" ("id" character varying(16) NOT NULL, "name" character varying(64) NOT NULL, "notesId" character varying(16), CONSTRAINT "PK_1727d6c80966414bf9543429d58" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "Room" ("id" character varying(16) NOT NULL, "sessionId" character varying(16) NOT NULL, "name" character varying(64) NOT NULL, "ready" boolean NOT NULL, "listsId" character varying(16), CONSTRAINT "PK_867d589be92524f89375e2e086d" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "User" ("id" character varying(16) NOT NULL, "sessionId" character varying(16) NOT NULL, CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`ALTER TABLE "Session" ADD "addLink" character varying(16) NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "Session" ADD "expirationTimestamp" integer NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "Session" ADD "phase" smallint NOT NULL DEFAULT 0`
		);
		await queryRunner.query(
			`ALTER TABLE "Session" DROP CONSTRAINT "PK_b2d57e0f3ce66780706d739e274"`
		);
		await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "id"`);
		await queryRunner.query(
			`ALTER TABLE "Session" ADD "id" character varying(16) NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "Session" ADD CONSTRAINT "PK_b2d57e0f3ce66780706d739e274" PRIMARY KEY ("id")`
		);
		await queryRunner.query(
			`ALTER TABLE "List" ADD CONSTRAINT "FK_d689f9c5af552bbcbea8fa56f24" FOREIGN KEY ("notesId") REFERENCES "Note"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "Room" ADD CONSTRAINT "FK_03b478ff5d3da1f2650a38b240f" FOREIGN KEY ("listsId") REFERENCES "List"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
	}
	async down(queryRunner) {
		await queryRunner.query(
			`ALTER TABLE "Room" DROP CONSTRAINT "FK_03b478ff5d3da1f2650a38b240f"`
		);
		await queryRunner.query(
			`ALTER TABLE "List" DROP CONSTRAINT "FK_d689f9c5af552bbcbea8fa56f24"`
		);
		await queryRunner.query(
			`ALTER TABLE "Session" DROP CONSTRAINT "PK_b2d57e0f3ce66780706d739e274"`
		);
		await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "id"`);
		await queryRunner.query(
			`ALTER TABLE "Session" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`
		);
		await queryRunner.query(
			`ALTER TABLE "Session" ADD CONSTRAINT "PK_b2d57e0f3ce66780706d739e274" PRIMARY KEY ("id")`
		);
		await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "phase"`);
		await queryRunner.query(
			`ALTER TABLE "Session" DROP COLUMN "expirationTimestamp"`
		);
		await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "addLink"`);
		await queryRunner.query(`DROP TABLE "User"`);
		await queryRunner.query(`DROP TABLE "Room"`);
		await queryRunner.query(`DROP TABLE "List"`);
		await queryRunner.query(`DROP TABLE "Note"`);
		await queryRunner.query(`DROP TABLE "Session"`);
	}
}
exports.init1591987924120 = init1591987924120;
//# sourceMappingURL=1591987924120-init.js.map
