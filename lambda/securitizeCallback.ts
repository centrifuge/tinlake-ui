import { APIGatewayEvent } from 'aws-lambda'
import dotenv from 'dotenv'
dotenv.config()

exports.handler = async (event: APIGatewayEvent) => {
  console.log({ event })

  return {
    statusCode: 200,
    body: 'Callback from Securitize received',
  }
}
