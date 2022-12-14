import {AppSync} from 'aws-sdk'
import {readFile} from 'fs/promises';
import {UpdateUserMutationVariables} from '../../../../../frontend/src/API';
const appsync = new AppSync({region: 'us-east-1'});
import path = require('path');
const file = '../../../../lib/resolvers/Mutation/updateUser/get.js';

test('validate an update user request', async () => {
  const context = JSON.stringify({
    arguments: {
      input: {
        name: 'test',
        profilePicture: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      }
    } as UpdateUserMutationVariables,
    prev: {
      result: null
    },
    identity: {
      sub: 'user1',
      claims: {
      },
      issuer: 'https://xxxxxxxxxx.auth0.com'
    }
  })
  const code = await readFile(path.join(__dirname, file), {encoding: 'utf8'})
  const runtime = { name: 'APPSYNC_JS', runtimeVersion: '1.0.0' }
  const params = {context, code, runtime, function: 'request'}
  const response = await appsync.evaluateCode(params).promise();
  expect(response.error).toBeUndefined()
  expect(response.evaluationResult).toBeDefined();
  const result = JSON.parse(response.evaluationResult as string)
  expect(result.key.PK.S).toEqual('USER#user1')
  expect(result.key.SK.S).toEqual('USER#user1')
})