/**
 * File: /src/modules/graphql/index.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 14-07-2021 22:10:40
 * Modified By: Clay Risser <email@clayrisser.com>
 * -----
 * Silicon Hills LLC (c) Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import KeycloakModule from '~/modules/keycloak';
import RedisModule from '~/modules/redis';
import GraphqlCacheProvider from './graphqlCache.provider';
import GraphqlSchemaService from './graphqlSchema.service';
import GraphqlService from './graphql.service';

@Module({
  exports: [GraphqlService, GraphqlSchemaService, GraphqlCacheProvider],
  providers: [GraphqlService, GraphqlSchemaService, GraphqlCacheProvider],
  imports: [KeycloakModule, ConfigModule, RedisModule]
})
export default class GraphqlModule {}

export { GraphqlService, GraphqlSchemaService, GraphqlCacheProvider };

export * from './graphqlCache.provider';
