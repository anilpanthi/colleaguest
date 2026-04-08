import * as migration_20260408_062011_initial_migration from './20260408_062011_initial_migration';

export const migrations = [
  {
    up: migration_20260408_062011_initial_migration.up,
    down: migration_20260408_062011_initial_migration.down,
    name: '20260408_062011_initial_migration'
  },
];
