const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.RESTAURANTS_TABLE;


exports.addrestaurant = async (event, context) => {

      const restaurant = JSON.parse(event.body);
      restaurant.restaurant_id = "r" + Date.now();
      const params = {
        TableName: tableName,
        Item: restaurant,
      };
      try {
        await dynamoDb.put(params).promise();
        return {
          statusCode: 201,
          body: JSON.stringify(restaurant),
        };
      } catch (error) {
        console.log(error)
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Could not save restaurant" }),
        };
      }
}


exports.getrestaurant = async (event) => {
    const query = event.queryStringParameters;
    let filterExpression = "";
    let expressionAttributeValues = {};
    if (query.restaurant_name) {
      filterExpression += "contains(restaurant_name, :restaurant_name)";
      expressionAttributeValues[":restaurant_name"] = query.restaurant_name;
    }
    if (query.location) {
      if (filterExpression.length > 0) {
        filterExpression += " AND ";
      }
      filterExpression += "contains(location, :location)";
      expressionAttributeValues[":location"] = query.location;
    }
    const params = {
      TableName: tableName,
      FilterExpression: filterExpression,
      ExpressionAttributeValues: expressionAttributeValues,
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
        body: JSON.stringify({ error: "Could not search restaurants" }),
      };
    }
}

exports.getrestaurants = async (event) => {
    try {
        const params = {
          TableName: tableName
        };
        const result = await dynamoDb.scan(params).promise();
        return {
          statusCode: 200,
          body: JSON.stringify(result.Items),
        };
      } catch (error) {
        console.log(error)
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Could not retrieve restaurants" }),
        };
      }
}


