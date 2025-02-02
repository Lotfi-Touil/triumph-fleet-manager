import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBreakdownSpareParts1710000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'breakdown_spare_parts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'breakdown_id',
            type: 'uuid',
          },
          {
            name: 'spare_part_id',
            type: 'varchar',
          },
          {
            name: 'quantity',
            type: 'integer',
          },
          {
            name: 'unit_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'breakdown_spare_parts',
      new TableForeignKey({
        columnNames: ['breakdown_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'breakdowns',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('breakdown_spare_parts');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('breakdown_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('breakdown_spare_parts', foreignKey);
    }
    await queryRunner.dropTable('breakdown_spare_parts');
  }
}
