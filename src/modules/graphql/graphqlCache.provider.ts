/**
 * File: /src/modules/graphql/graphqlCache.provider.ts
 * Project: example-nestjs
 * File Created: 14-07-2021 21:53:41
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 14-07-2021 22:12:36
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

import { Redis } from 'ioredis';
import { BaseRedisCache } from 'apollo-server-cache-redis';
import { KeyValueCache } from 'apollo-server-caching';
import { FactoryProvider } from '@nestjs/common';
import { REDIS_CLIENT } from '../redis';

export const GRAPHQL_CACHE = 'GRAPHQL_CACHE';

const GraphqlCacheProvider: FactoryProvider<KeyValueCache> = {
  provide: GRAPHQL_CACHE,
  inject: [REDIS_CLIENT],
  useFactory: (redisClient: Redis) => {
    return new BaseRedisCache({
      client: redisClient
    });
  }
};

export default GraphqlCacheProvider;
