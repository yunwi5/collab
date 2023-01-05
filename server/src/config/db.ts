import * as dynamoose from 'dynamoose';
import { envConfig } from './env-config';

export const configureDynamoDB = () => {
  if (envConfig.Testing) {
    dynamoose.aws.ddb.local();
  } else {
    // Create new DynamoDB instance
    const ddb = new dynamoose.aws.ddb.DynamoDB({
      region: envConfig.AwsRegion,
      accessKeyId: envConfig.AwsAccessKeyId,
      secretAccessKey: envConfig.AwsAccessSecret,
    } as any);

    // Set DynamoDB instance to the Dynamoose DDB instance
    dynamoose.aws.ddb.set(ddb);
  }
};
