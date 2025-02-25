const { CosmosClient } = require('@azure/cosmos');

// Initialize Azure Cosmos DB client
const cosmosClient = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY
});

// Database and container references
const database = cosmosClient.database(process.env.COSMOS_DATABASE);
const container = database.container('summaries');

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const userId = event.queryStringParameters.userId;
    
    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User ID is required' })
      };
    }
    
    // Query summaries for this user
    const querySpec = {
      query: "SELECT * FROM c WHERE c.userId = @userId ORDER BY c.createdAt DESC",
      parameters: [
        {
          name: "@userId",
          value: userId
        }
      ]
    };
    
    const { resources: summaries } = await container.items.query(querySpec).fetchAll();
    
    // Return summaries
    return {
      statusCode: 200,
      body: JSON.stringify(summaries)
    };
    
  } catch (error) {
    console.error('Error listing summaries:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to list summaries',
        details: error.message
      })
    };
  }
}; 