import { MigrationInterface, QueryRunner } from 'typeorm';

export class CREATETABLES1706886744484 implements MigrationInterface {
  name = 'CREATETABLES1706886744484';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "graph" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_eb3e36eefae596e0ba9122fff16" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "points" ("id" SERIAL NOT NULL, "location" geography(Point,4326), "graph" integer, CONSTRAINT "PK_57a558e5e1e17668324b165dadf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "logs" ("id" SERIAL NOT NULL, "level" character varying NOT NULL, "message" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "requestIp" character varying, CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "edges" ("id" SERIAL NOT NULL, "line" geography(LineString,4326), "distance" double precision NOT NULL, "origin" integer, "destiny" integer, "graph" integer, CONSTRAINT "PK_46bb3dd9779f5e6d0d2200cc1b0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "points" ADD CONSTRAINT "FK_a6e6f3c9c651fa2030805b78c8a" FOREIGN KEY ("graph") REFERENCES "graph"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "edges" ADD CONSTRAINT "FK_27bc5bae6c9bb9ea89341013155" FOREIGN KEY ("origin") REFERENCES "points"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "edges" ADD CONSTRAINT "FK_600992981903e866702517440c3" FOREIGN KEY ("destiny") REFERENCES "points"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "edges" ADD CONSTRAINT "FK_09205e41a19c9abb72ef7c1b0b1" FOREIGN KEY ("graph") REFERENCES "graph"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "edges" DROP CONSTRAINT "FK_09205e41a19c9abb72ef7c1b0b1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "edges" DROP CONSTRAINT "FK_600992981903e866702517440c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "edges" DROP CONSTRAINT "FK_27bc5bae6c9bb9ea89341013155"`,
    );
    await queryRunner.query(
      `ALTER TABLE "points" DROP CONSTRAINT "FK_a6e6f3c9c651fa2030805b78c8a"`,
    );
    await queryRunner.query(`DROP TABLE "edges"`);
    await queryRunner.query(`DROP TABLE "logs"`);
    await queryRunner.query(`DROP TABLE "points"`);
    await queryRunner.query(`DROP TABLE "graph"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
