#!/bin/bash

json_output='{
    "authorization_code": "",
    "jwt_secret_key": "",
    "oauth_client_id": "",
    "oauth_client_secret": ""
}'

json_output=$(echo "$json_output" | jq \
    --arg auth_code "$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")" \
    --arg jwt_key "$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")" \
    --arg client_id "$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")" \
    --arg client_secret "$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")" \
    '.authorization_code = $auth_code |
     .jwt_secret_key = $jwt_key |
     .oauth_client_id = $client_id |
     .oauth_client_secret = $client_secret')

echo "$json_output" > generated_secrets.json
