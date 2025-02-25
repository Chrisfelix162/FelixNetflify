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
    const summaryId = event.path.split('/').pop();
    
    if (!summaryId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Summary ID is required' })
      };
    }
    
    // Get summary from Cosmos DB
    const { resource: summary } = await container.item(summaryId, summaryId).read();
    
    if (!summary) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Summary not found' })
      };
    }
    
    // Return summary data
    return {
      statusCode: 200,
      body: JSON.stringify(summary)
    };
    
  } catch (error) {
    console.error('Error retrieving summary:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to retrieve summary',
        details: error.message
      })
    };
  }
}; 