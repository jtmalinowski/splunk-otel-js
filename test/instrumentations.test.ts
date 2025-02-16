/*
 * Copyright Splunk Inc.
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

import * as sinon from 'sinon';
import * as assert from 'assert';
import * as rewire from 'rewire';

import * as instrumentations from '../src/instrumentations';
import * as loader from '../src/instrumentations/loader';

describe('instrumentations', () => {
  const supportedInstrumentations = [
    ['@opentelemetry/instrumentation-bunyan', 'BunyanInstrumentation'],
    [
      '@opentelemetry/instrumentation-cassandra-driver',
      'CassandraDriverInstrumentation',
    ],
    ['@opentelemetry/instrumentation-dns', 'DnsInstrumentation'],
    ['@opentelemetry/instrumentation-express', 'ExpressInstrumentation'],
    ['@opentelemetry/instrumentation-graphql', 'GraphQLInstrumentation'],
    ['@opentelemetry/instrumentation-grpc', 'GrpcInstrumentation'],
    ['@opentelemetry/instrumentation-hapi', 'HapiInstrumentation'],
    ['@opentelemetry/instrumentation-http', 'HttpInstrumentation'],
    ['@opentelemetry/instrumentation-ioredis', 'IORedisInstrumentation'],
    ['@opentelemetry/instrumentation-knex', 'KnexInstrumentation'],
    ['@opentelemetry/instrumentation-koa', 'KoaInstrumentation'],
    ['@opentelemetry/instrumentation-memcached', 'MemcachedInstrumentation'],
    ['@opentelemetry/instrumentation-mongodb', 'MongoDBInstrumentation'],
    ['@opentelemetry/instrumentation-mysql', 'MySQLInstrumentation'],
    ['@opentelemetry/instrumentation-mysql2', 'MySQL2Instrumentation'],
    ['@opentelemetry/instrumentation-net', 'NetInstrumentation'],
    ['@opentelemetry/instrumentation-pg', 'PgInstrumentation'],
    ['@opentelemetry/instrumentation-pino', 'PinoInstrumentation'],
    ['@opentelemetry/instrumentation-redis', 'RedisInstrumentation'],
    ['@opentelemetry/instrumentation-restify', 'RestifyInstrumentation'],
    ['@opentelemetry/instrumentation-winston', 'WinstonInstrumentation'],
    ['opentelemetry-instrumentation-amqplib', 'AmqplibInstrumentation'],
    ['opentelemetry-instrumentation-aws-sdk', 'AwsInstrumentation'],
    [
      'opentelemetry-instrumentation-elasticsearch',
      'ElasticsearchInstrumentation',
    ],
    ['opentelemetry-instrumentation-kafkajs', 'KafkaJsInstrumentation'],
    ['opentelemetry-instrumentation-mongoose', 'MongooseInstrumentation'],
    ['opentelemetry-instrumentation-sequelize', 'SequelizeInstrumentation'],
    ['opentelemetry-instrumentation-typeorm', 'TypeormInstrumentation'],
  ];

  it('does not load if packages are not installed', () => {
    const inst = instrumentations.getInstrumentations();
    // Note: the number here is the devDependencies instrumentation count.
    assert.strictEqual(inst.length, 4);
  });

  it('load instrumentations if they are not installed', () => {
    const loadStub = sinon.stub(loader, 'load');
    const inst = instrumentations.getInstrumentations();
    sinon.assert.callCount(loadStub, supportedInstrumentations.length);
    for (let i = 0; i < supportedInstrumentations.length; i++) {
      sinon.assert.calledWith(
        loader.load,
        supportedInstrumentations[i][0],
        supportedInstrumentations[i][1]
      );
    }

    loadStub.reset();
    loadStub.restore();
  });

  it('loader silently fails when package is not installed', () => {
    const loader = require('../src/instrumentations/loader');
    const result = loader.load(
      '@opentelemetry/instrumentation-dns',
      'DnsInstrumentation'
    );
    assert.strictEqual(result, null);
  });

  it('loader imports and returns object when package is available', () => {
    const HttpInstrumentation = function () {};
    const loader = rewire('../src/instrumentations/loader');
    const revert = loader.__set__('require', module => {
      return { HttpInstrumentation };
    });

    const got = loader.load(
      '@opentelemetry/instrumentation-http',
      'HttpInstrumentation'
    );
    assert.strictEqual(got, HttpInstrumentation);

    revert();
  });
});
