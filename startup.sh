#!/bin/bash

# Base path for SSM parameters
BASE_PATH=$1
if [ -z "$BASE_PATH" ]; then
  echo "Usage: $0 <base-path>"
  exit 1
fi

# Fetch parameters from AWS SSM
echo "Fetching parameters from SSM path: $BASE_PATH"
PARAMETERS=$(aws ssm get-parameters-by-path --path "/$BASE_PATH" --recursive --with-decryption --query "Parameters[*].[Name,Value]" --output text)

if [ -z "$PARAMETERS" ]; then
  echo "No parameters found for path: $BASE_PATH"
  exit 1
fi

# Write to .env file
ENV_FILE=".env"
echo "# Generated from SSM path: $BASE_PATH" > $ENV_FILE
while read -r NAME VALUE; do
  # Convert parameter name (e.g., /dev/legacy/DB_URL) to ENV_VAR (DB_URL)
  ENV_NAME=$(echo "$NAME" | sed "s|/$BASE_PATH/||" | tr '[:lower:]' '[:upper:]' | tr '/' '_')
  echo "$ENV_NAME=\"$VALUE\"" >> $ENV_FILE
done <<< "$PARAMETERS"

echo "Environment variables written to $ENV_FILE"
