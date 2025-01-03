#pragma once
#include <eosio/eosio.hpp>

// Adds superpower testing functions (required for running cpp tests/clearing data in contract)
#define TESTING true

// Crypto
#define MBEDTLS_ASN1_OCTET_STRING 0x04

// contract name
#define CONTRACT_NAME_MACRO CONTRACT_NAME
#define CHAIN_ID_MACRO CHAIN_ID

namespace evm_bridge
{
  static constexpr auto WORD_SIZE       = 32u;
  static constexpr size_t CURRENT_CHAIN_ID = CHAIN_ID_MACRO;
  static constexpr eosio::name EVM_SYSTEM_CONTRACT = eosio::name("eosio.evm");
  static constexpr uint64_t SIGN_REGISTRATION_GAS = 250000; // Todo: find exact needed gas
  static constexpr uint64_t REFUND_CB_GAS = 250000; // Todo: find exact needed gas
  static constexpr uint64_t SUCCESS_CB_GAS = 250000; // Todo: find exact needed gas
  static constexpr uint64_t BRIDGE_GAS = 250000; // Todo: find exact needed gas
  static constexpr auto EVM_SUCCESS_CALLBACK_SIGNATURE = "0fbc79cd";
  static constexpr auto EVM_REFUND_CALLBACK_SIGNATURE = "dc2fdf9f";
  static constexpr auto EVM_BRIDGE_SIGNATURE = "7d056de7";
  static constexpr auto EVM_SIGN_REGISTRATION_SIGNATURE = "a1d22913";
  static constexpr uint8_t STORAGE_BRIDGE_REQUEST_INDEX = 4;
  static constexpr uint8_t STORAGE_BRIDGE_REFUND_INDEX = 5;
  static constexpr uint8_t STORAGE_REGISTER_REQUEST_INDEX = 4;
  static constexpr uint8_t STORAGE_REGISTER_PAIR_INDEX = 3;
}