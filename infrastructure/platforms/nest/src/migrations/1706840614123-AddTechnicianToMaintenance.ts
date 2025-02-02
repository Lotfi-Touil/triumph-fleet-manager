import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddTechnicianToMaintenance1706840614123
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'maintenances',
      new TableColumn({
        name: 'technician_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'maintenances',
      new TableForeignKey({
        columnNames: ['technician_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('maintenances');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('technician_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('maintenances', foreignKey);
    }
    await queryRunner.dropColumn('maintenances', 'technician_id');
  }
}
