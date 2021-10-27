import { readEnv } from '../env';
import { Pool, PoolConfig, QueryResult } from 'pg';
import { String, Boolean, QueryResultShort } from '../../types';
import { readFileSync } from 'fs';
import { User } from '../../entities';
import * as fsExtra from 'fs-extra';

export class Database {
  public static schemaName: String = 'skitter';
  private static initialized: Boolean = false;
  private static pool: Pool;

  static async init(): Promise<Boolean>  {
    if(!Database.initialized) {
      Database.pool = new Pool(Database.getConfig());
      try {
        await Database.pool.connect();

        const testResult:QueryResultShort = await Database.query('SELECT NOW();');
        if(testResult.rowCount !== 1) return Promise.reject('Test query couldn\'t be processed');

        Database.initialized = true;
        console.log('Database connection established successfully.');

        if(readEnv().startWithReset) {
          console.log('\nDatabase reset flag is set. Removing all entities...');
          await Database.query('DROP SCHEMA IF EXISTS skitter CASCADE; DROP TYPE IF EXISTS ROLES;');
          console.log('Read and create schema from SQL doc file.');
          await Database.query(Database.readSqlDoc());

          console.log('Clean content directory.');
          fsExtra.emptyDirSync(readEnv().savePath);

          console.log('Create admin user');
          const user = new User('admin', 'admin', 'Creator');
          user.role = 'Admin';
          await user.save();
          console.log('Done.\n');
        }
      } catch (e) {
        console.log('Database connection couldn\'t be established.', e);
        return Promise.reject('Connection couldn\'t be established');
      }
    }
    return Database.initialized;
  }

  static async query(queryText: String, values?: any[]): Promise<QueryResultShort>{
    try {
      const result: QueryResult = values ?
        await Database.pool.query(queryText, values) :
        await Database.pool.query(queryText);
      return {
        rows: result.rows,
        rowCount: result.rowCount
      };
    } catch (e) {
      console.error('Query execution failed with: ', e);
      return Promise.reject('Query failed');
    }
  }
  
  static async close(): Promise<void> {
    return await Database.pool.end();
  }
  
  private static getConfig(): PoolConfig {
    return {
      ...readEnv().database,

      // Connection configuration
      min: 10,
      max: 60,
      idleTimeoutMillis: 60_000,
      connectionTimeoutMillis: 6_000
    } as PoolConfig;
  }

  private static readSqlDoc(): String {
    return readFileSync(readEnv().sqlDocPath, { encoding: 'ASCII', flag: 'r' });
  }
}