import Knex from 'knex';
import path from 'path';
import { ConfigService } from '@nestjs/config';
import { FactoryProvider } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { ServiceCreator } from '@graphback/core';
import { buildGraphbackAPI, GraphbackAPI } from 'graphback';
import { createKnexDbProvider } from '@graphback/runtime-knex';
import { createMongoDbProvider } from '@graphback/runtime-mongo';
import { migrateDB, removeNonSafeOperationsFilter } from 'graphql-migrations';
import { readFileSync } from 'fs';
import { KEYCLOAK_CRUD_SERVICE } from '~/modules/keycloak';

const logger = console;

export const GRAPHBACK = 'GRAPHBACK';

const GraphbackProvider: FactoryProvider<Promise<GraphbackAPI>> = {
  provide: GRAPHBACK,
  inject: [ConfigService, KEYCLOAK_CRUD_SERVICE],
  useFactory: async (
    config: ConfigService,
    keycloakCrudService: ServiceCreator
  ) => {
    const { dataProviderCreator, migrate } = await getDatabaseEngine(config);
    const model = readFileSync(
      path.resolve(__dirname, '../../../model/datamodel.graphql'),
      'utf8'
    );
    const result = buildGraphbackAPI(model, {
      serviceCreator: keycloakCrudService,
      dataProviderCreator
    });
    if (migrate) {
      await migrate(result);
      logger.log('Migrated database');
    }
    return result;
  }
};

export async function getDatabaseEngine(config: ConfigService) {
  const databaseEngine = config.get('DATABASE_ENGINE') as DatabaseEngine;
  if (databaseEngine === DatabaseEngine.Mongo) {
    const URL = `mongodb://${config.get('MONGO_HOST')}:${config.get(
      'MONGO_PORT'
    )}`;
    const client = await MongoClient.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const db = client.db(config.get('MONGO_DATABASE'));
    const dataProviderCreator = createMongoDbProvider(db);
    return { dataProviderCreator };
  }
  if (databaseEngine === DatabaseEngine.Postgres) {
    const dbConfig = {
      client: 'pg',
      connection: {
        user: config.get('POSTGRES_USER'),
        password: config.get('POSTGRES_PASSWORD'),
        database: config.get('POSTGRES_DATABASE'),
        host: config.get('POSTGRES_HOST'),
        port: Number(config.get('POSTGRES_PORT') || 5432)
      },
      pool: { min: 5, max: 30 }
    };
    const db = Knex(dbConfig);
    const dataProviderCreator = createKnexDbProvider(db);
    async function migrate({ typeDefs }: GraphbackAPI) {
      await migrateDB(dbConfig, typeDefs, {
        operationFilter: removeNonSafeOperationsFilter
      });
    }
    return { dataProviderCreator, migrate };
  }
  throw new Error(`database engine '${databaseEngine}' is invalid`);
}

export enum DatabaseEngine {
  Mongo = 'mongo',
  Postgres = 'postgres'
}

export default GraphbackProvider;
