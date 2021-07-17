/**
 * File: /src/modules/auth/index.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 17-07-2021 01:44:39
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

import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AuthController } from './controller';
import { AuthResolver } from './resolver';

@Module({
  controllers: [AuthController],
  exports: [AuthResolver],
  imports: [HttpModule],
  providers: [AuthResolver]
})
export default class AuthModule implements OnModuleInit {
  private logger = new Logger(AuthModule.name);

  constructor(private readonly httpService: HttpService) {}

  onModuleInit() {}
}

export * from './controller';
export * from './resolver';
