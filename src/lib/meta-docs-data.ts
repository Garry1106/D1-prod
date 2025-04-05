export const documentationContent = {
    'getting-started': {
      title: 'Getting Started with Facebook Meta Integration',
      content: `## Overview
  
  Follow these detailed steps to integrate your app with Facebook Meta APIs. This guide walks you through:
  
  - Retrieving required details
  - Verifying your domain and token
  - Completing the setup process
  
  Let's begin with gathering the necessary information for your integration.`
    },
    'gather-details': {
      title: 'Step 1: Gather Required Details',
      content: `## Required Information
  
  To begin, collect the following information from your Facebook Meta Business account:
  
  ### 1. Phone Number
  - **Description**: WhatsApp-enabled phone number for your Business account
  - **Location**: WhatsApp Business Dashboard
  - **Action Required**: Confirm or add your business phone number
  
  ### 2. Business Phone Number ID
  - **Steps to Find**:
    - Access Meta Business Account Dashboard
    - Navigate to WhatsApp Manager
    - Select your business number
    - Locate Phone Number ID in settings
  
  \`\`\`javascript
  // Business Phone Number ID Example:
  Business Phone Number ID: 123456789012345
  \`\`\`
  
  ### 3. Access Token
  - **Purpose**: Authentication for API requests
  - **Steps to Generate**:
    - Visit Meta for Developers App Dashboard
    - Navigate to Settings > Advanced
    - Generate Token with permissions:
      - whatsapp_business_management
      - whatsapp_business_messaging
  
  \`\`\`bash
  // cURL Example to get Access Token
  curl -X GET 'https://graph.facebook.com/v17.0/me?access_token=EAAGm0PX4ZCpsBAHxKQ7u...'
  \`\`\`
  
  > **Security Note**: Always store tokens securely using environment variables or a secrets manager.`
    },
    'verify-domain': {
      title: 'Step 2: Verify Domain and Token',
      content: `## Domain Verification Process
  
  ### 1. Access Settings
  - Navigate to Business Settings in Meta Business Manager
  - Locate Brand Safety > Domains section
  - Click "Add Domain" button
  
  ### 2. Verification Methods
  Choose one of the following methods:
  
  - **HTML File Upload**
    - Download verification file
    - Upload to website root directory
    - Confirm accessibility
  
  - **Meta Tag**
    - Copy provided meta tag
    - Add to website's head section
    - Verify implementation
  
  - **DNS TXT Record**
    - Access DNS settings
    - Add provided TXT record
    - Allow propagation time
  
  ## Token Verification Process
  
  ### 1. Testing Steps
  - Retrieve Access Token from Step 1
  - Use Graph API Explorer or cURL:
  
  \`\`\`bash
  curl -X GET "https://graph.facebook.com/v17.0/me?access_token=YOUR_ACCESS_TOKEN"
  \`\`\`
  
  ### 2. Expected Response
  A valid token returns:
  
  \`\`\`json
  {
      "id": "1234567890",
      "name": "Your App Name"
  }
  \`\`\`
  
  > **Note**: If verification fails, ensure token hasn't expired and permissions are correct.`
    },
    'complete-setup': {
      title: 'Step 3: Complete Setup',
      content: `## Final Steps
  
  ### 1. Integration Testing
  - Access Graph API Explorer
  - Attempt test API calls
  - Verify response formats
  
  ### 2. Verification Process
  - Send test messages
  - Confirm data retrieval
  - Check webhook functionality
  
  ### 3. Production Readiness
  - Monitor API limits
  - Implement error handling
  - Document integration details
  
  > **Success Indicator**: Your integration is complete when all test cases pass and production endpoints respond as expected.`
    },
    'resources': {
      title: 'Additional Resources',
      content: `## Official Documentation
  
  ### Primary Resources
  1 [Meta for Developers Documentation](https://developers.facebook.com/docs)
    - Complete API reference
    - Best practices
    - Sample code
  
  ### API-Specific Guides
  1 [WhatsApp Business API Guide](https://developers.facebook.com/docs/whatsapp)
    - Message templates
    - Webhook setup
    - Rate limits
  
  ### Technical References
  1 [Graph API Reference](https://developers.facebook.com/docs/graph-api)
    - Endpoints
    - Authentication
    - Error handling`
    }
  };
  
  export interface DocStep {
    id: string;
    title: string;
    completed: boolean;
  }
  
  export interface DocContent {
    title: string;
    content: string;
  }
  
  export const documentationSteps: DocStep[] = [
    { id: 'getting-started', title: 'Getting Started with Facebook Meta Integration', completed: false },
    { id: 'gather-details', title: 'Step 1: Gather Required Details', completed: false },
    { id: 'verify-domain', title: 'Step 2: Verify Domain and Token', completed: false },
    { id: 'complete-setup', title: 'Step 3: Complete Setup', completed: false },
    { id: 'resources', title: 'Additional Resources', completed: false },
  ];