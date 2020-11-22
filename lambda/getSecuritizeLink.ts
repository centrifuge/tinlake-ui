import { APIGatewayEvent } from 'aws-lambda'
import dotenv from 'dotenv'
dotenv.config()

const { SECURITIZE_CLIENT_ID } = process.env

exports.handler = async (event: APIGatewayEvent) => {
  if (!SECURITIZE_CLIENT_ID) {
    return {
      statusCode: 500,
      body: 'One of the required environment variables for the getSecuritizeLink lambda to work is not set',
    }
  }

  const scope = `info%20details%20verification`
  const redirectUrl = 'http://localhost:9000/securitizeCallback'
  const url = `https://id.sandbox.securitize.io/#/authorize?issuerId=${SECURITIZE_CLIENT_ID}&scope=${scope}&redirecturl=${redirectUrl}`

  return {
    statusCode: 200,
    body: url,
  }
}
