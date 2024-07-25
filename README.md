# Data IO Extension App Reference Implementation
## Introduction
This reference implementation models the use case of taking an agreement PDF sent by the Docusign platform using a data IO extension app and storing it locally.

## Setup instructions
### 1. Clone the repository
Run the following command to clone the repository: 
```bash
git clone https://github.com/docusign/extension-app-data-writeback-reference-implementation.git
```

### 2. Generate secret values
- If you already have values for `JWT_SECRET_KEY`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, and `AUTHORIZATION_CODE`, you may skip this step.

The easiest way to generate a secret value is to run the following command:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'));"
```

You will need values for `JWT_SECRET_KEY`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, and `AUTHORIZATION_CODE`.

### 2. Set the environment variables for the cloned repository
- If you're running this in a development environment, create a copy of `example.development.env` and save it as `development.env`.
- If you're running this in a production environment, create a copy of `example.production.env` and save it as `production.env`.
- Replace `JWT_SECRET_KEY`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, and `AUTHORIZATION_CODE` in `development.env` or `production.env` with your generated values. These values will be used to configure the sample proxy's mock authentication server. 
- Set the `clientId` value in the manifest.json file to the same value as `OAUTH_CLIENT_ID`.
- Set the `clientSecret` value in the manifest.json file to the same value as `OAUTH_CLIENT_SECRET`.
### 3. [Install and configure Node.js and npm on your machine.](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
### 4. Install dependencies
Run the following command to install the necessary dependencies:
```bash
npm install
```
### 5. Running the proxy server
#### Development mode:
Start the proxy server in development mode by running the command:
```bash
npm run dev
```

This will create a local server on the port in the `development.env` file (port 3000 by default) that listens for local changes that trigger a rebuild.

#### Production mode:
Start the proxy server in production mode by running the following commands:
```bash
npm run build
npm run start
```

This will start a production build on the port in the `production.env` file (port 3000 by default). 
## Setting up ngrok
### 1. [Install and configure ngrok for your machine.](https://ngrok.com/docs/getting-started/)
### 2. Start ngrok
Run the following command to create a public accessible tunnel to your localhost:

```bash
ngrok http <PORT>
```

Replace `<PORT>` with the port number in the `development.env` or `production.env` file.

### 3. Save the forwarding address
Copy the `Forwarding` address from the response. You’ll need this address in your `manifest.json` file.

```bash
ngrok                                                    

Send your ngrok traffic logs to Datadog: https://ngrok.com/blog-post/datadog-log

Session Status                online
Account                       email@domain.com (Plan: Free)
Update                        update available (version 3.3.1, Ctrl-U to update)
Version                       3.3.0
Region                        United States (us)
Latency                       60ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://bbd7-12-202-171-35.ngrok-free.app -> http:

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

In this example, the `Forwarding` address to copy is `https://bbd7-12-202-171-35.ngrok-free.app`.
## Create an extension app
### 1. Prepare your app manifest
Replace `<PROXY_BASE_URL>` in your manifest.json file with the ngrok forwarding address in the following sections:
- `connections.params.customConfig.profile.url`
- `connections.params.customConfig.tokenUrl`
- `connections.params.customConfig.authorizationUrl`
- `actions.params.uri`
    * Replace this value for all of the actions.

### 2. Navigate to the [Developer Console](https://devconsole.docusign.com/apps)
Log in with your Docusign developer credentials and create a new app.

### 3. Upload your manifest and create the data IO app
To [create your extension app](https://developers.docusign.com/extension-apps/build-an-extension-app/create/), open the [Developer Console](https://devconsole.docusign.com/apps) and select **+New App.** In the app manifest editor that opens, upload your manifest file or paste into the editor itself; then select Validate. Once the editor validates your manifest, select **Create App.** 

### 4. Test the extension app
This reference implementation uses mock data to simulate how data can be verified against a database. [Test your extension](https://developers.docusign.com/extension-apps/build-an-extension-app/test/) using the sample data in [fileDB.ts](https://github.com/docusign/extension-app-data-io-reference-implementation/blob/main/src/db/fileDB.ts). Extension app tests include [integration tests](https://developers.docusign.com/extension-apps/build-an-extension-app/test/integration-tests/) (connection tests and extension tests), [functional tests](https://developers.docusign.com/extension-apps/build-an-extension-app/test/functional-tests/), and [App Center preview](https://developers.docusign.com/extension-apps/build-an-extension-app/test/app-center-preview/). 


### Extension tests
The Developer Console offers five extension tests to verify that a data IO extension app can connect to and exchange data with third-party APIs (or an API proxy that in turn connects with those APIs). 

**Note:** These instructions only apply if you use the [mock data](https://github.com/docusign/extension-app-data-io-reference-implementation/blob/main/src/db/fileDB.ts) in the reference implementation. If you use your own database, you’ll need to construct your requests based on your own schema. Queries for extension tests in the Developer Console are built using [IQuery](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/custom-query-language/) structure. 


#### CreateRecord extension test
To begin the extension test process, run the CreateRecord test using the input provided in the Developer Console. The test should return a response containing the record ID.

![CreateRecord Test](https://github.com/user-attachments/assets/76cb05d3-07ba-4697-906e-af75530a61e2)

All record types are located in the `/src/db/` folder of this repository.

![DB folder](https://github.com/user-attachments/assets/38efe238-cac1-4250-b45d-b6bce4417fc1)


Open the `sampleTypeName.json` file in the `/src/db/` folder and check that the records were created.

![sampletypename.json](https://github.com/user-attachments/assets/3c4df8b2-b850-4032-8f9e-5e4a730b35dc)


#### SearchRecords extension test
This query searches the records that have been created. You don’t have to use the same sample values used here; the search should work with a valid attribute in `sampleTypeName.json`.

Open the SearchRecords test and create a new query based on the `sampleTypeName.json` file:

- The `from` attribute maps to the value of `typeName` in the CreateRecord query; in this case, `sampleTypeName`.
- The `data` array from the CreateRecord query maps to the `attributesToSelect` array; in this case, `sampleKey1`.
- The `name` property of the `leftOperand` object should be the value of `sampleKey1`; in this case, `sampleValue1`.
- The `operator` value should be `EQUALS`.
- The `name` property of the `rightOperand` object should be the same as what's in `attributesToSelect` array; in this case, `sampleKey1`.

The query below has been updated based on the directions above. You can copy and paste this into the SearchRecords test input box.

```json
{
    "query": {
        "$class": "sampleQueryClass",
        "attributesToSelect": [
            "sampleKey1"
        ],
        "from": "sampleTypeName",
        "queryFilter": {
            "$class": "sampleQueryFilterClass",
            "operation": {
                "$class": "sampleOperationClass",
                "leftOperand": {
                    "$class": "sampleLeftOperandClass",
                    "name": "sampleValue1",
                    "type": "INTEGER",
                    "isLiteral": true
                },
                "operator": "EQUALS",
                "rightOperand": {
                    "$class": "sampleRightOperandClass",
                    "name": "sampleKey1",
                    "type": "INTEGER",
                    "isLiteral": false
                }
            }
        }
    },
    "pagination": {
        "limit": 10,
        "skip": 10
    }
}
```

Running the test will return the record you queried.

![SearchRecord test](https://github.com/user-attachments/assets/e9f3d2ed-bf96-4fad-922f-1e37411a2f48)


#### PatchRecord extension test
The `recordId` property in the sample input maps to an `Id` in the `sampleTypeName.json` file. Any valid record ID can be used in this field.

In the `data` array, include any attributes and values to be added to the record. In this query, a new property will be added and the original data in the record will be updated.

```bash
{
    "typeName": "sampleTypeName",
    "recordId": "0",
    "idempotencyKey": "sampleIdempotencyKey",
    "data": {
        "sampleKey1": "updatedSampleValue1",
        "sampleKey2": "updatedSampleValue2",
        "sampleKey3": "newSampleValue3"
    }
}
```

Running the test should return the response `"success": true`.

![PatchRecord test](https://github.com/user-attachments/assets/adda7f2f-6dd0-4df4-b06c-3195873e2a20)


Rerun the SearchRecords extension test to search for the new patched values. 

**Input query:**

```json
    "query": {
        "$class": "sampleQueryClass",
        "attributesToSelect": [
            "sampleKey1"
        ],
        "from": "sampleTypeName",
        "queryFilter": {
            "$class": "sampleQueryFilterClass",
            "operation": {
                "$class": "sampleOperationClass",
                "leftOperand": {
                    "$class": "sampleLeftOperandClass",
                    "name": "updatedSampleValue1",
                    "type": "INTEGER",
                    "isLiteral": true
                },
                "operator": "EQUALS",
                "rightOperand": {
                    "$class": "sampleRightOperandClass",
                    "name": "sampleKey1",
                    "type": "INTEGER",
                    "isLiteral": false
                }
            }
        }
    },
    "pagination": {
        "limit": 10,
        "skip": 10
    }
}
```

**Results:**

![Results of SearchRecords after PatchRecord](https://github.com/user-attachments/assets/950270ea-7abb-497a-afb0-be37f5c85ed2)


Alternatively, the `sampleTypeName.json` file will contain the updated records. 

![sampleTypeName.json after PatchRecord test](https://github.com/user-attachments/assets/f462d380-646f-4606-a9c3-07ed64f712f1)
