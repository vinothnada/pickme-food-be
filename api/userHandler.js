const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.USERS_TABLE;


exports.adduser = async (event, context) => {
      const user = JSON.parse(event.body);
      user.user_id = "u" + Date.now();
      const params = {
        TableName: tableName,
        Item: user,
      };
      try {
        await dynamoDb.put(params).promise();
        return {
          statusCode: 201,
          body: JSON.stringify(user),
        };
      } catch (error) {
        console.log(error)
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Could not save user" }),
        };
      }
}


exports.getusers = async (event) => {
    try {
        const params = {
            TableName: tableName,
          };
          const data = await dynamoDb.scan(params).promise();

        return {
            statusCode : 200,
            body : JSON.stringify(data)
        }
    } catch (error) {
        console.log(error);
        return {
            statusCode : error.statusCode ? error.statusCode : 500,
            body : JSON.stringify({ 
                error : error.name ? error.name : 'Exception',
                message : error.message ? error.message : "Unknown error"
            })
        }
    }
}


exports.getuser = async (event) => {
    try {
        const item = JSON.parse(event.body);
        const username =  item.username;
        const password =  item.password;
        
        let params = {
            TableName:tableName,
            FilterExpression: "username = :un AND password = :pw",
            ExpressionAttributeValues: {
                ":un": username,
                ":pw": password,
            },
        }

        let data = await dynamoDb.scan(params).promise();
        if(data.Items.length > 0){
            return {
                statusCode : 200,
                body : JSON.stringify(data)
            }
        }else{
            return {
                statusCode : 200,
                body : JSON.stringify({
                    message : "User not found"
                })
            }
        }


    } catch (error) {
        console.log(error);
        return {
            statusCode : error.statusCode ? error.statusCode : 500,
            body : JSON.stringify({
                error : error.name ? error.name : 'Exception',
                message : error.message ? error.message : "Unknown error"
            })
        }
    }
}