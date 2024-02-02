import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

export class ExecuteBackupSql1706844846229 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Caminho para o arquivo SQL
    const sqlFilePath = path.join(__dirname, 'db.sql');

    // Ler o conteúdo do arquivo SQL
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    // Executar o SQL
    await queryRunner.query(sql);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.clearDatabase();
  }
}
