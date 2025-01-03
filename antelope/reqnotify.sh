#!/bin/bash

# Path to JSON file
CONFIG_FILE="./config.json"

# Check if the JSON file exists
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Error: Config file $CONFIG_FILE not found!"
  exit 1
fi

# Extract CONTRACT_NAME from JSON using jq
CONTRACT_NAME=$(jq -r '.CONTRACT_NAME' "$CONFIG_FILE")
MAINNET_URL=$(jq -r '.MAINNET_URL' "$CONFIG_FILE")
TESTNET_URL=$(jq -r '.TESTNET_URL' "$CONFIG_FILE")

# Check if values were extracted successfully
if [ -z "$CONTRACT_NAME" ] || [ "$CONTRACT_NAME" == "null" ]; then
  echo "Error: CONTRACT_NAME not found or empty in $CONFIG_FILE!"
  exit 1
fi

if [ -z "$MAINNET_URL" ] || [ "$MAINNET_URL" == "null" ]; then
  echo "Error: MAINNET_URL not found or empty in $CONFIG_FILE!"
  exit 1
fi

if [ -z "$TESTNET_URL" ] || [ "$TESTNET_URL" == "null" ]; then
  echo "Error: TESTNET_URL not found or empty in $CONFIG_FILE!"
  exit 1
fi

# Determine the URL (mainnet or testnet)
if [ "$1" == "mainnet" ]; then
  url="$MAINNET_URL"
  echo ">>> Using Telos Mainnet endpoint: $url"
else
  url="$TESTNET_URL"
  echo ">>> Using Telos Testnet endpoint: $url"
fi

# Call the reqnotify action
echo ">>> Calling reqnotify() on contract: $CONTRACT_NAME"
cleos --url "$url" push action "$CONTRACT_NAME" reqnotify '{}' -p "$CONTRACT_NAME"

