import { APIGatewayProxyResultV2, Context, APIGatewayProxyEventV2 } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEventV2,context: Context): Promise<APIGatewayProxyResultV2> => {
	const result = {
		message: 'Hello User!',
		event,
		context,
	};
	
	return {
		statusCode: 200,
		body: JSON.stringify(result)
	};
};