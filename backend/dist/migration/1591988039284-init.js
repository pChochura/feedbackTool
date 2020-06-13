"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init1591988039284 = void 0;
class init1591988039284 {
    constructor() {
        this.name = 'init1591988039284';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "List" DROP CONSTRAINT "FK_d689f9c5af552bbcbea8fa56f24"`);
        await queryRunner.query(`ALTER TABLE "Room" DROP CONSTRAINT "FK_03b478ff5d3da1f2650a38b240f"`);
        await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "addLink"`);
        await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "expirationTimestamp"`);
        await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "phase"`);
        await queryRunner.query(`ALTER TABLE "List" DROP COLUMN "notesId"`);
        await queryRunner.query(`ALTER TABLE "Room" DROP COLUMN "listsId"`);
        await queryRunner.query(`ALTER TABLE "Session" ADD "addLink" character varying(16) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Session" ADD "expirationTimestamp" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Session" ADD "phase" smallint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "Session" DROP CONSTRAINT "PK_b2d57e0f3ce66780706d739e274"`);
        await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "Session" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "Session" ADD CONSTRAINT "PK_b2d57e0f3ce66780706d739e274" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "Session" DROP CONSTRAINT "PK_b2d57e0f3ce66780706d739e274"`);
        await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "Session" ADD "id" character varying(16) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Session" ADD CONSTRAINT "PK_b2d57e0f3ce66780706d739e274" PRIMARY KEY ("id")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "Session" DROP CONSTRAINT "PK_b2d57e0f3ce66780706d739e274"`);
        await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "Session" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "Session" ADD CONSTRAINT "PK_b2d57e0f3ce66780706d739e274" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "Session" DROP CONSTRAINT "PK_b2d57e0f3ce66780706d739e274"`);
        await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "Session" ADD "id" character varying(16) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Session" ADD CONSTRAINT "PK_b2d57e0f3ce66780706d739e274" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "phase"`);
        await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "expirationTimestamp"`);
        await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "addLink"`);
        await queryRunner.query(`ALTER TABLE "Room" ADD "listsId" character varying(16)`);
        await queryRunner.query(`ALTER TABLE "List" ADD "notesId" character varying(16)`);
        await queryRunner.query(`ALTER TABLE "Session" ADD "phase" smallint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "Session" ADD "expirationTimestamp" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Session" ADD "addLink" character varying(16) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Room" ADD CONSTRAINT "FK_03b478ff5d3da1f2650a38b240f" FOREIGN KEY ("listsId") REFERENCES "List"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "List" ADD CONSTRAINT "FK_d689f9c5af552bbcbea8fa56f24" FOREIGN KEY ("notesId") REFERENCES "Note"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
exports.init1591988039284 = init1591988039284;
//# sourceMappingURL=1591988039284-init.js.map