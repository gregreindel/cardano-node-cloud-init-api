
const responseWrapper = (statusCode, data) => {
    const body = JSON.stringify({
      [statusCode === 400 ? 'message' : 'data']: JSON.stringify(data),
    })
  
    return {
      body,
      statusCode,
      isBase64Encoded: false,
      headers: {
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
        "X-Requested-With": "*",
        "Content-Type": "application/json",
      },
    }
  };

  module.exports = {
    responseWrapper
  }