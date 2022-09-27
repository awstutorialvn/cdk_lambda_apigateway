import * as path from 'path';
import { Construct } from 'constructs';
import { StackProps, CfnOutput, Stack } from 'aws-cdk-lib';
import { CorsHttpMethod, HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkLambdaApigatewayStack extends Stack {
  	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);
		const stackName = process.env.STACK_NAME ?? 'apiLambda';
		const httpApi = new HttpApi(this, 'http-api', {
			apiName: `${stackName}-http-api`,
			description: `HTTP API for ${stackName}`,
			corsPreflight: {
				allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
				allowMethods: [
					CorsHttpMethod.OPTIONS,
					CorsHttpMethod.GET,
					CorsHttpMethod.POST,
					CorsHttpMethod.PUT,
					CorsHttpMethod.PATCH,
					CorsHttpMethod.DELETE,
				],
			},
		});
		new CfnOutput(this, `${stackName}-api-url`, { value: httpApi.url! });

		const lambdaFunction = new NodejsFunction(this, `${stackName}-lambda`, {
            functionName: `${stackName}-lambda`,
            runtime: Runtime.NODEJS_16_X,
			handler: 'handler',
            entry: path.join(__dirname, `../src/functions/index.ts`),
            bundling: {
                minify: false,
                externalModules: [],
            },
        });

		httpApi.addRoutes({
			path: '/lambda',
			methods: [HttpMethod.GET],
			integration: new HttpLambdaIntegration(`${stackName}-integration`, lambdaFunction),
		});
	}
}
