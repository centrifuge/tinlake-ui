import { APIGatewayEvent } from 'aws-lambda'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()

const { SECURITIZE_API_HOST, SECURITIZE_CLIENT_ID, SECURITIZE_SECRET } = process.env

exports.handler = async (event: APIGatewayEvent) => {
  if (!SECURITIZE_API_HOST) {
    return {
      statusCode: 500,
      body: 'One of the required environment variables for the securitizeCallback lambda to work is not set',
    }
  }

  console.log({ event })

  const code = event.queryStringParameters?.code
  const url = `${SECURITIZE_API_HOST}v1/${SECURITIZE_CLIENT_ID}/oauth2/authorize`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${SECURITIZE_SECRET}`,
    },
    body: JSON.stringify({ code }),
  })

  const content = await response.json()
  console.log({ content })

  return {
    statusCode: 200,
    body: 'Callback from Securitize received',
  }
}
