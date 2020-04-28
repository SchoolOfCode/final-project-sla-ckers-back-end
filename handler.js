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

//POST REQUEST:
module.exports.createOrg = (event, context, callback) => {
  //context holds env variables, AWS stuff, etc.
  //callback sends response or error
  const reqBody = JSON.parse(event.body); //request body
  //validation - if org name isn't there or empty, it errors out (can add others later)
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
    threeThings: reqBody.threeThings,
    contactName: reqBody.contactName,
    contactDetails: reqBody.contactDetails,
    img: reqBody.img,
  };

  return db
    .put({
      TableName: orgsTable,
      Item: org,
    })
    .promise()
    .then(() => {
      callback(null, response(201, org)); //uses helper function defined above to pass 201 as the status code and the org itself as the message
    })
    .catch((err) => response(null, response(err.statusCode, err)));
};

//GET ALL ORGS:
module.exports.getAllOrgs = (event, context, callback) => {
  return db
    .scan({
      TableName: orgsTable,
    })
    .promise()
    .then((res) => callback(null, response(200, res.Items.sort(sortByDate))))
    .catch((err) => callback(null, response(err.statusCode, err)));
};

// //GET ORG BY ID:
// module.exports.getOrg = (event, context, callback) => {
//   const id = event.pathParameters.id;

//   const params = {
//     Key: {
//       id: id
//     },
//     TableName: orgsTable
//   }

//   return db.get(params).promise().then(
//     res=>{
//       if(res.Item) callback(null, response(200, res.Item))
//       else callback(null, response(404, {error: 'organisation not found'}))
//     }
//   ).catch((err)=> callback(null, response(err.statusCode, err)))
// }

// // //UPDATE ORG:
// // module.exports.updatePost = (event, context, callback){
// //   const id = event.pathParameters.id;
// //   const body = JSON.parse(event.body);
// //   //DynamoDB can only update one field at a time!
// //   const paramName = body.orgName
// // }
//TODO: finish this - partway done
