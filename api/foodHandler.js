const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.FOOD_TABLE;


exports.addfood = async (event, context) => {

      const food = JSON.parse(event.body);
      food.food_id = "f" + Date.now();
      const params = {
        TableName: tableName,
        Item: food,
      };
      try {
        await dynamoDb.put(params).promise();
        return {
          statusCode: 201,
          body: JSON.stringify(food),
        };
      } catch (error) {
        console.log(error)
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Could not save food" }),
        };
      }
      
}

exports.getfood = async (event) => {
    const restaurant_id = event.queryStringParameters.restaurant_id;
    const params = {
      TableName: tableName,
      FilterExpression: "restaurant_id = :restaurant_id",
      ExpressionAttributeValues: {
        ":restaurant_id": restaurant_id,
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
        body: JSON.stringify({ error: "Could not retrieve food" }),
      };
    }
}


