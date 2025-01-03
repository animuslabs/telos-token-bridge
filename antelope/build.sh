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
CHAIN_ID_MAINNET=$(jq -r '.CHAIN_ID_MAINNET' "$CONFIG_FILE")
CHAIN_ID_TESTNET=$(jq -r '.CHAIN_ID_TESTNET' "$CONFIG_FILE")

# Check if CONTRACT_NAME was extracted successfully
if [ -z "$CONTRACT_NAME" ] || [ "$CONTRACT_NAME" == "null" ]; then
  echo "Error: CONTRACT_NAME not found or empty in $CONFIG_FILE!"
  exit 1
fi

# Determine chain ID based on user input
if [ "$1" == "mainnet" ]; then
  CHAIN_ID=$CHAIN_ID_MAINNET
  echo ">>> Using Mainnet ID: $CHAIN_ID"
elif [ "$1" == "testnet" ]; then
  CHAIN_ID=$CHAIN_ID_TESTNET
  echo ">>> Using Testnet ID: $CHAIN_ID"
else
  echo "Error: Invalid network specified! Please use 'mainnet' or 'testnet'."
  exit 1
fi

# Validate CHAIN_ID
if [ -z "$CHAIN_ID" ] || [ "$CHAIN_ID" == "null" ]; then
  echo "Error: CHAIN_ID not found or empty for the selected network in $CONFIG_FILE!"
  exit 1
fi

echo ">>> Building contract with CONTRACT_NAME: $CONTRACT_NAME and CHAIN_ID: $CHAIN_ID"
# Create build directory if it doesn't exist
if [ ! -d "$PWD/build" ]; then
  mkdir -p build
fi

# Compile the contract with eosio-cpp, defining CONTRACT_NAME_MACRO
eosio-cpp -I="./include/" -I="./external/" \
  -D CONTRACT_NAME="\"$CONTRACT_NAME\"" \
  -D CHAIN_ID="$CHAIN_ID" \
  -o="./build/$CONTRACT_NAME.wasm" \
  -contract=$CONTRACT_NAME \
  -abigen -abigen_output="./build/$CONTRACT_NAME.abi" \
  ./src/tokenBridge.cpp

echo ">>> Build complete. CONTRACT_NAME set to: $CONTRACT_NAME, CHAIN_ID set to: $CHAIN_ID"
