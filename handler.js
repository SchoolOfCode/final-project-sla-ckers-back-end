'use strict';
const AWS = require('aws-sdk'); //requires AWS
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2019.11.21' }); //requires DynamoDB
const uuid = require('uuid/v4'); //requires UUID, the thing that generates the IDs for us

//gets table info from the config file (the yml)
const orgsTable = process.env.ORGS_TABLE;

//helper function to create the response sent:
function response(statusCode, message) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'GET, OPTIONS, POST, PUT',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  };
}

function sortByDate(a, b) {
  if (a.createdAt > b.createdAt) {
    return -1;
  } else {
    return 1;
  }
}

//--------POST NEW ORG:--------

module.exports.createOrg = (event, context, callback) => {
  //context holds env variables, AWS stuff, etc.
  //callback sends response or error

  const reqBody = JSON.parse(event.body); //request body

  //validation - must have name:
  if (!reqBody.orgName || reqBody.orgName.trim() === '') {
    return callback(null, response(400, { error: 'Org must have name' }));
  }

  const org = {
    id: uuid(),
    createdAt: new Date().toISOString(),
    orgName: reqBody.orgName,
    category: reqBody.category,
    briefBio: reqBody.briefBio,
    opportunities: reqBody.opportunities,
    qualities: reqBody.qualities,
    contactName: reqBody.contactName,
    contactDetails: reqBody.contactDetails,
    img: reqBody.img,
    uid: reqBody.uid,
  };

  return db
    .put({
      TableName: orgsTable,
      Item: org,
    })
    .promise()
    .then(() => {
      callback(null, response(200, org)); //uses helper function defined above to pass 201 (or 200 - changed it to this to bug-fix CORS) as the status code and the org itself as the message
    })
    .catch((err) => response(null, response(err.statusCode, err)));
};

//--------GET ALL ORGS:--------

module.exports.getAllOrgs = (event, context, callback) => {
  return db
    .scan({
      TableName: orgsTable,
    })
    .promise()
    .then((res) => callback(null, response(200, res.Items.sort(sortByDate))))
    .catch((err) => callback(null, response(err.statusCode, err)));
};

//--------GET ORG BY ID:--------

module.exports.getOrg = (event, context, callback) => {
  //gets the id out of the url parameters:
  const id = event.pathParameters.id;

  //sets up the params to tell the db which table and that the key will be the id grabbed from the url:
  const params = {
    Key: {
      id: id,
    },
    TableName: orgsTable,
  };

  return db
    .get(params)
    .promise()
    .then((res) => {
      //checks if there's an org with that id; if so, it's stored in res.Item
      if (res.Item) callback(null, response(200, res.Item));
      else
        callback(null, response(404, { error: 'No org with that name found' }));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};

//--------UPDATE ORG - ALL ATTRIBUTES:--------

module.exports.updateOrg = (event, context, callback) => {
  const id = event.pathParameters.id;
  const reqBody = JSON.parse(event.body);

  const org = {
    id: id,
    createdAt: new Date().toISOString(),
    orgName: reqBody.orgName,
    category: reqBody.category,
    briefBio: reqBody.briefBio,
    opportunities: reqBody.opportunities,
    qualities: reqBody.qualities,
    contactName: reqBody.contactName,
    contactDetails: reqBody.contactDetails,
    img: reqBody.img,
    uid: reqBody.uid,
  };

  return db
    .put({
      TableName: orgsTable,
      Item: org,
    })
    .promise()
    .then((res) => {
      callback(null, response(200, res));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};

//--------UPDATE ORG - SINGLE ATTRIBUTE:--------

module.exports.updateOrgAttribute = (event, context, callback) => {
  const id = event.pathParameters.id;
  const body = JSON.parse(event.body);

  const paramName = body.paramName;
  const paramValue = body.paramValue;

  const params = {
    Key: {
      id: id,
    },
    TableName: orgsTable,
    ConditionExpression: 'attribute_exists(id)',
    UpdateExpression: `set ${paramName} = :v`,
    ExpressionAttributeValues: {
      ':v': paramValue,
    },
    ReturnValue: 'ALL_NEW',
  };

  return db
    .update(params)
    .promise()
    .then((res) => {
      callback(null, response(200, { paramName, paramValue }));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};

//--------DELETE ORG:--------

module.exports.deleteOrg = (event, context, callback) => {
  const id = event.pathParameters.id;

  const params = {
    Key: {
      id: id,
    },
    TableName: orgsTable,
  };

  return db
    .delete(params)
    .promise()
    .then(() =>
      callback(
        null,
        response(200, { message: `Org ${id} deleted successfully` })
      )
    )
    .catch((err) => callback(null, response(err.statusCode, err)));
};
