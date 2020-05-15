# Back End for Volt

## Project background:

For our School of Code final project, presented on Demo Day, 14 May 2020, we created Volt, a dating app-style PWA for matching volunteers to opportunities.

Front end hosted here: https://volt-sla.netlify.app/

This repo holds the code deployed to the back end via Serverless to AWS Lambda (incl. S3 and API Gateway) and AWS DynamoDB, which holds the data for the volunteer organisations and opportunities.

As our app is a PWA, we knew we didn’t necessarily need an “always on” back end; we only needed it to respond when requests came in. A serverless approach fit this best in a scalable, cost-efficient way, while any performance penalties wouldn’t have a huge impact. Also, Serverless smoothly deploys our back end functions straight into AWS Lambda, so it’s convenient to make any changes or updates. It was a bit of a challenge to get it set up as it was a departure from the Express servers we’d been used to during most of the course, but once we persevered, asked for guidance from the bootcamp and the amazing tech community where we needed it, and put in the elbow grease to get it successfully up and running, it was smooth sailing from there.

This feeds into AWS DynamoDB. We considered the data we’d be holding, frequency of requests, and how complicated the queries would be. This helped us know key-value data in NoSQL was the way to go. Also, as we’d used PostgreSQL during the bootcamp, we wanted to branch out and learn something new. From here, we investigated options and chose AWS DynamoDB because it was well-documented, straightforward, and played nicely with Serverless.

## Deploying changes:

sls deploy

## Acknowledgements:

Thank you to Alexa Berry (@not_that_Alexa
) and Sarah Barkley (@Barkle_Sarah), intrepid Team SLA-ckers members and Volt co-creators!

Much love to Chris, Ben, and the whole School of Code family for giving us the skills, encouragement, and safe space to become developers.

Thanks to my mentor Emmanouil Kiagias for his patience and help.

And shout out to Gareth McCumskey (@garethmcc) at Serverless HQ for reaching out on Twitter and helping me figure out how to slay the demon CORS error, and to Ionut Craciunescu (@icraciunescu) for introducing our bootcamp to Serverless and reviewing this code!
