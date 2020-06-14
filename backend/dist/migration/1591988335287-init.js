'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.init1591988335287 = void 0;
class init1591988335287 {
	constructor() {
		this.name = 'init1591988335287';
	}
	async up(queryRunner) {
		await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "addLink"`);
		await queryRunner.query(
			`ALTER TABLE "Session" DROP COLUMN "expirationTimestamp"`
		);
		await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "phase"`);
		await queryRunner.query(
			`ALTER TABLE "Note" ADD "listId" character varying(16)`
		);
		await queryRunner.query(
			`ALTER TABLE "List" ADD "roomId" character varying(16)`
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
			`ALTER TABLE "Session" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`
		);
		await queryRunner.query(
			`ALTER TABLE "Session" ADD CONSTRAINT "PK_b2d57e0f3ce66780706d739e274" PRIMARY KEY ("id")`
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
			`ALTER TABLE "Note" ADD CONSTRAINT "FK_b2c3a638b3d224c79718682e738" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "List" ADD CONSTRAINT "FK_99b7acca30d16c678d5462d810b" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
	}
	async down(queryRunner) {
		await queryRunner.query(
			`ALTER TABLE "List" DROP CONSTRAINT "FK_99b7acca30d16c678d5462d810b"`
		);
		await queryRunner.query(
			`ALTER TABLE "Note" DROP CONSTRAINT "FK_b2c3a638b3d224c79718682e738"`
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
		await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "phase"`);
		await queryRunner.query(
			`ALTER TABLE "Session" DROP COLUMN "expirationTimestamp"`
		);
		await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "addLink"`);
		await queryRunner.query(`ALTER TABLE "List" DROP COLUMN "roomId"`);
		await queryRunner.query(`ALTER TABLE "Note" DROP COLUMN "listId"`);
		await queryRunner.query(
			`ALTER TABLE "Session" ADD "phase" smallint NOT NULL DEFAULT 0`
		);
		await queryRunner.query(
			`ALTER TABLE "Session" ADD "expirationTimestamp" integer NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "Session" ADD "addLink" character varying(16) NOT NULL`
		);
	}
}
exports.init1591988335287 = init1591988335287;
//# sourceMappingURL=1591988335287-init.js.map
