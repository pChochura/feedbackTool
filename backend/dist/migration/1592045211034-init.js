'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.init1592045211034 = void 0;
class init1592045211034 {
	constructor() {
		this.name = 'init1592045211034';
	}
	async up(queryRunner) {
		await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "addLink"`);
		await queryRunner.query(
			`ALTER TABLE "Session" DROP COLUMN "expirationTimestamp"`
		);
		await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "phase"`);
		await queryRunner.query(
			`ALTER TABLE "Note" ADD "positive" boolean NOT NULL`
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
	}
	async down(queryRunner) {
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
		await queryRunner.query(`ALTER TABLE "Note" DROP COLUMN "positive"`);
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
exports.init1592045211034 = init1592045211034;
//# sourceMappingURL=1592045211034-init.js.map
