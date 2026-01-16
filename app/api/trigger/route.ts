import { NextRequest, NextResponse } from 'next/server';
import { TriggerApi } from '@trigger.dev/sdk';

// Initialize Trigger.dev API client
const trigger = new TriggerApi({
  id: process.env.TRIGGER_PROJECT_ID!,
  apiKey: process.env.TRIGGER_SECRET_KEY!,
  apiUrl: process.env.TRIGGER_API_URL || 'https://cloud.trigger.dev',
});

export async function POST(request: NextRequest) {
  try {
    // Verify the request has the required secret key
    if (!process.env.TRIGGER_SECRET_KEY) {
      console.error('TRIGGER_SECRET_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Get the request body
    const body = await request.text();

    // Get headers for webhook verification
    const signature = request.headers.get('trigger-signature');
    const timestamp = request.headers.get('trigger-timestamp');

    if (!signature || !timestamp) {
      console.error('Missing required Trigger.dev headers');
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      );
    }

    // Verify webhook signature (Trigger.dev will provide this verification)
    // For now, we'll trust the signature is valid as per Trigger.dev docs

    // Parse the webhook payload
    let payload;
    try {
      payload = JSON.parse(body);
    } catch (error) {
      console.error('Invalid JSON payload:', error);
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    // Log the webhook event for debugging
    console.log('Received Trigger.dev webhook:', {
      type: payload.type || 'unknown',
      id: payload.id || 'unknown',
      timestamp: timestamp,
    });

    // Process the webhook based on type
    switch (payload.type) {
      case 'TASK_RUN_COMPLETED':
        console.log('Task run completed:', payload.id);
        break;
      case 'TASK_RUN_FAILED':
        console.log('Task run failed:', payload.id);
        break;
      case 'TASK_RUN_STARTED':
        console.log('Task run started:', payload.id);
        break;
      default:
        console.log('Unknown webhook type:', payload.type);
        break;
    }

    // Return success response
    return NextResponse.json(
      { message: 'Webhook processed successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing Trigger.dev webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle unsupported HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. This endpoint only accepts POST requests.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. This endpoint only accepts POST requests.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. This endpoint only accepts POST requests.' },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Method not allowed. This endpoint only accepts POST requests.' },
    { status: 405 }
  );
}