import {MigrationInterface, QueryRunner} from "typeorm";

export class init1592062459909 implements MigrationInterface {
    name = 'init1592062459909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Note" DROP CONSTRAINT "FK_b2c3a638b3d224c79718682e738"`);
        await queryRunner.query(`ALTER TABLE "List" DROP CONSTRAINT "FK_99b7acca30d16c678d5462d810b"`);
        await queryRunner.query(`ALTER TABLE "Room" DROP COLUMN "ownNotes"`);
        await queryRunner.query(`ALTER TABLE "Room" ADD "ownNotes" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "Note" ADD CONSTRAINT "FK_b2c3a638b3d224c79718682e738" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "List" ADD CONSTRAINT "FK_99b7acca30d16c678d5462d810b" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "List" DROP CONSTRAINT "FK_99b7acca30d16c678d5462d810b"`);
        await queryRunner.query(`ALTER TABLE "Note" DROP CONSTRAINT "FK_b2c3a638b3d224c79718682e738"`);
        await queryRunner.query(`ALTER TABLE "Room" DROP COLUMN "ownNotes"`);
        await queryRunner.query(`ALTER TABLE "Room" ADD "ownNotes" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "List" ADD CONSTRAINT "FK_99b7acca30d16c678d5462d810b" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Note" ADD CONSTRAINT "FK_b2c3a638b3d224c79718682e738" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
