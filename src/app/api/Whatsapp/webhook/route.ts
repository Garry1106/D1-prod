import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req:Request) {
  try {

    const formData = await req.json();

    console.log(formData)
    const { phoneNumberId, appId, appSecret, accessToken } = formData;

    // if (!phoneNumberId || !appId || !appSecret) {
    //   return NextResponse.json(
    //     { success: false, error: 'Missing required parameters: phoneNumberId, appId, and appSecret.' },
    //     { status: 400 }
    //   );
    // }

    // // Step 1: Fetch access token
    // const tokenResponse = await axios.get('https://graph.facebook.com/oauth/access_token', {
    //   params: {
    //     client_id: appId,
    //     client_secret: appSecret,
    //     grant_type: 'client_credentials',
    //   },
    // });

    // const pageToken = tokenResponse.data.access_token;

    // // Step 2: Configure webhook subscription
    // const appID = appId;
    // const webhookUrl = `https://app.sucetastech.com/webhook/${phoneNumberId}`;
    // const endpoint = `https://graph.facebook.com/v21.0/${appID}/subscriptions`;

    // const headers = {
    //   Authorization: `Bearer ${pageToken}`,
    //   'Content-Type': 'application/json',
    // };

    // const payload = {
    //   object: 'whatsapp_business_account',
    //   callback_url: webhookUrl,
    //   fields: 'messages',
    //   verify_token: '122333',
    // };

    // const webhookResponse = await axios.post(endpoint, payload, { headers });

    // // Step 3: Verify the access token
    // const debugTokenUrl = `https://graph.facebook.com/debug_token`;
    // const debugTokenResponse = await axios.get(debugTokenUrl, {
    //   params: {
    //     input_token: pageToken,
    //     access_token: accessToken, // App access token
    //   },
    // });

    // const debugData = debugTokenResponse.data;

    return NextResponse.json(
      {
        success: true,
        message: 'Webhook successfully configured and verified.',
        // data: webhookResponse.data,
        // debugData: debugData,
      },
      { status: 200 }
      // webhookResponse.status
    );


  } catch (error: any) {
    if (error.response) {
      console.error('API Error:', error.response.data);

      let errorMessage = 'An unknown error occurred.';
      const errorStatus = error.response.status;

      // Handle specific status codes
      if (errorStatus === 400) {
        errorMessage = 'Bad Request: Please check the provided parameters.';
      } else if (errorStatus === 401) {
        errorMessage = 'Unauthorized: Invalid client credentials or access token.';
      } else if (errorStatus === 403) {
        errorMessage = 'Forbidden: Insufficient permissions to perform this action.';
      } else if (errorStatus === 404) {
        errorMessage = 'Not Found: The specified resource could not be located.';
      } else if (errorStatus === 500) {
        errorMessage = 'Internal Server Error: Something went wrong on the server.';
      }

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
          error: error.response.data,
        },
        { status: errorStatus }
      );
    }

    console.error('General Error:', error.message);
    return NextResponse.json(
      { success: false, message: 'A general error occurred.', error: error.message },
      { status: 500 }
    );
  }
}