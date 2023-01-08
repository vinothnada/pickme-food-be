const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.ORDER_TABLE;


exports.addorder = async (event, context) => {

      const order = JSON.parse(event.body);
      order.order_id = "o" + Date.now();
      const params = {
        TableName: tableName,
        Item: order,
      };
      try {
        await dynamoDb.put(params).promise();
        return {
          statusCode: 201,
          body: JSON.stringify(order),
        };
      } catch (error) {
        console.log(error)
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Could not save order" }),
        };
      }
      
}

exports.getorder = async (event) => {
    const order_id = event.queryStringParameters.order_id;
    const params = {
      TableName: tableName,
      FilterExpression: "order_id = :order_id",
      ExpressionAttributeValues: {
        ":order_id": order_id,
      },
    };
    try {
      const result = await dynamoDb.scan(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify(result.Items),
      };
    } catch (error) {
      console.log(error)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Could not retrieve order" }),
      };
    }
}

exports.getorders = async (event) => {
  const params = {
    TableName: tableName,
  };
  
  try {
    const data = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not retrieve orders" }),
    };
  }
}


