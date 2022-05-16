import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddTableQuotesData1652651026211 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        CREATE TABLE quotes_data(
          id SERIAL NOT NULL PRIMARY KEY,
          symbol VARCHAR(20) NOT NULL,
          data JSONB NOT NULL,
          updated_at DATE DEFAULT NOW()
        )
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE quotes_data');
  }

}
