/**
 * Unit tests for branded address types and type guards.
 *
 * Tests the accept/reject matrix for:
 * - isStrKeyAddress: valid/invalid StrKey addresses
 * - isContractAddress: contract addresses (C...) with valid/invalid formats
 * - isAccountAddress: account addresses (G...) with valid/invalid formats
 * - isPublicKeyHex: raw public keys in hex format
 */

import { describe, it, expect } from "vitest";
import {
  isStrKeyAddress,
  isContractAddress,
  isAccountAddress,
  isPublicKeyHex,
} from "../../src/policy.ts";

describe("Type Guards", () => {
  describe("isStrKeyAddress", () => {
    it("should accept valid account addresses (G...)", () => {
      // Valid Stellar account addresses from the SDK test fixtures
      const validAccountAddresses = [
        "GBRPYHIL2CI3WHZDTOOQFC6EB4CGQOFN4L7MRJE47JREUMB5QFO6YL2",
        "GB7BDSOOQCFFVLZ37PF5LTQVLNCJYJ5ONUH3MBIUCUSD4B2LGYXJJPM",
        "GCZST3XVCDTUJ76ZAV2HA72KYQJWKCPVNXS6XFTVMS7VHCBTEJUH45H3",
      ];
      for (const addr of validAccountAddresses) {
        expect(isStrKeyAddress(addr)).toBe(true);
      }
    });

    it("should accept valid contract addresses (C...)", () => {
      // Valid Stellar contract addresses
      const validContractAddresses = [
        "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4",
        "CA7QKFUKGMJ5HGHZ6EXW7H3OFUKZ5C5GN7NNFQN7N5NPEZRWWBQB7OD",
      ];
      for (const addr of validContractAddresses) {
        expect(isStrKeyAddress(addr)).toBe(true);
      }
    });

    it("should reject empty strings", () => {
      expect(isStrKeyAddress("")).toBe(false);
    });

    it("should reject whitespace-only strings", () => {
      expect(isStrKeyAddress("   ")).toBe(false);
    });

    it("should reject invalid prefixes", () => {
      expect(isStrKeyAddress("TAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4")).toBe(
        false,
      );
      expect(isStrKeyAddress("XAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4")).toBe(
        false,
      );
    });

    it("should reject strings with invalid length", () => {
      expect(isStrKeyAddress("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")).toBe(
        false,
      );
      expect(isStrKeyAddress("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4EXTRA")).toBe(
        false,
      );
    });

    it("should reject non-string types", () => {
      expect(isStrKeyAddress(null)).toBe(false);
      expect(isStrKeyAddress(undefined)).toBe(false);
      expect(isStrKeyAddress(123)).toBe(false);
      expect(isStrKeyAddress({ address: "GB..." })).toBe(false);
      expect(isStrKeyAddress([])).toBe(false);
    });

    it("should reject strings with invalid characters", () => {
      expect(isStrKeyAddress("GB7BDSOOQCFFVLZ37PF5LTQVLNCJYJ5ONUH3MBIUCUSD4B2LGYXJJP!")).toBe(
        false,
      );
      expect(isStrKeyAddress("GB7BDSOOQCFFVLZ37PF5LTQVLNCJYJ5ONUH3MBIUCUSD4B2LGYXJJP#")).toBe(
        false,
      );
    });
  });

  describe("isContractAddress", () => {
    it("should accept valid contract addresses (C...)", () => {
      const validContractAddresses = [
        "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4",
        "CA7QKFUKGMJ5HGHZ6EXW7H3OFUKZ5C5GN7NNFQN7N5NPEZRWWBQB7OD",
      ];
      for (const addr of validContractAddresses) {
        expect(isContractAddress(addr)).toBe(true);
      }
    });

    it("should reject account addresses (G...)", () => {
      const accountAddresses = [
        "GBRPYHIL2CI3WHZDTOOQFC6EB4CGQOFN4L7MRJE47JREUMB5QFO6YL2",
        "GB7BDSOOQCFFVLZ37PF5LTQVLNCJYJ5ONUH3MBIUCUSD4B2LGYXJJPM",
      ];
      for (const addr of accountAddresses) {
        expect(isContractAddress(addr)).toBe(false);
      }
    });

    it("should reject invalid prefix", () => {
      expect(isContractAddress("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4")).toBe(
        false,
      );
      expect(isContractAddress("TAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4")).toBe(
        false,
      );
    });

    it("should reject invalid length", () => {
      // Too short
      expect(isContractAddress("CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")).toBe(
        false,
      );
      // Too long
      expect(isContractAddress("CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4EXTRA")).toBe(
        false,
      );
    });

    it("should reject mixed case (contracts are case-sensitive)", () => {
      expect(isContractAddress("ca7qkfukgmj5hghz6exw7h3ofukz5c5gn7nnfqn7n5npezrwwbqb7od")).toBe(
        false,
      );
    });

    it("should reject non-string types", () => {
      expect(isContractAddress(null)).toBe(false);
      expect(isContractAddress(undefined)).toBe(false);
      expect(isContractAddress(123)).toBe(false);
      expect(isContractAddress({ contract: "C..." })).toBe(false);
    });

    it("should reject empty strings", () => {
      expect(isContractAddress("")).toBe(false);
    });

    it("should reject strings with invalid characters", () => {
      expect(isContractAddress("CA7QKFUKGMJ5HGHZ6EXW7H3OFUKZ5C5GN7NNFQN7N5NPEZRWWBQB7O!")).toBe(
        false,
      );
    });
  });

  describe("isAccountAddress", () => {
    it("should accept valid account addresses (G...)", () => {
      const validAccountAddresses = [
        "GBRPYHIL2CI3WHZDTOOQFC6EB4CGQOFN4L7MRJE47JREUMB5QFO6YL2",
        "GB7BDSOOQCFFVLZ37PF5LTQVLNCJYJ5ONUH3MBIUCUSD4B2LGYXJJPM",
        "GCZST3XVCDTUJ76ZAV2HA72KYQJWKCPVNXS6XFTVMS7VHCBTEJUH45H3",
      ];
      for (const addr of validAccountAddresses) {
        expect(isAccountAddress(addr)).toBe(true);
      }
    });

    it("should reject contract addresses (C...)", () => {
      const contractAddresses = [
        "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4",
        "CA7QKFUKGMJ5HGHZ6EXW7H3OFUKZ5C5GN7NNFQN7N5NPEZRWWBQB7OD",
      ];
      for (const addr of contractAddresses) {
        expect(isAccountAddress(addr)).toBe(false);
      }
    });

    it("should reject invalid prefix", () => {
      expect(
        isAccountAddress("CBRPYHIL2CI3WHZDTOOQFC6EB4CGQOFN4L7MRJE47JREUMB5QFO6YL2"),
      ).toBe(false);
      expect(
        isAccountAddress("TBRPYHIL2CI3WHZDTOOQFC6EB4CGQOFN4L7MRJE47JREUMB5QFO6YL2"),
      ).toBe(false);
    });

    it("should reject invalid length", () => {
      // Too short
      expect(isAccountAddress("GBRPYHIL2CI3WHZDTOOQFC6EB4CGQOFN4L7MRJE47JREUMB5QFO6YL")).toBe(
        false,
      );
      // Too long
      expect(
        isAccountAddress("GBRPYHIL2CI3WHZDTOOQFC6EB4CGQOFN4L7MRJE47JREUMB5QFO6YL2EXTRA"),
      ).toBe(false);
    });

    it("should reject mixed case", () => {
      expect(
        isAccountAddress("gbrpyhil2ci3whzdtooqfc6eb4cgqofn4l7mrje47jreumb5qfo6yl2"),
      ).toBe(false);
    });

    it("should reject non-string types", () => {
      expect(isAccountAddress(null)).toBe(false);
      expect(isAccountAddress(undefined)).toBe(false);
      expect(isAccountAddress(123)).toBe(false);
      expect(isAccountAddress({ account: "G..." })).toBe(false);
    });

    it("should reject empty strings", () => {
      expect(isAccountAddress("")).toBe(false);
    });

    it("should reject strings with invalid characters", () => {
      expect(
        isAccountAddress("GBRPYHIL2CI3WHZDTOOQFC6EB4CGQOFN4L7MRJE47JREUMB5QFO6YL!"),
      ).toBe(false);
    });
  });

  describe("isPublicKeyHex", () => {
    it("should accept valid 64-character hex strings", () => {
      const validHexKeys = [
        "0000000000000000000000000000000000000000000000000000000000000000",
        "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
      ];
      for (const key of validHexKeys) {
        expect(isPublicKeyHex(key)).toBe(true);
      }
    });

    it("should accept mixed case hex strings", () => {
      expect(isPublicKeyHex("AbCdEf0123456789AbCdEf0123456789AbCdEf0123456789AbCdEf0123456789")).toBe(
        true,
      );
    });

    it("should reject strings shorter than 64 characters", () => {
      expect(isPublicKeyHex("abcdef0123456789abcdef0123456789abcdef0123456789abcdef012345678")).toBe(
        false,
      );
    });

    it("should reject strings longer than 64 characters", () => {
      expect(
        isPublicKeyHex(
          "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789ab",
        ),
      ).toBe(false);
    });

    it("should reject strings with non-hex characters", () => {
      expect(isPublicKeyHex("ghijkl0123456789abcdef0123456789abcdef0123456789abcdef0123456789")).toBe(
        false,
      );
      expect(isPublicKeyHex("abcdef0123456789abcdef0123456789abcdef0123456789abcdef012345678!")).toBe(
        false,
      );
    });

    it("should reject non-string types", () => {
      expect(isPublicKeyHex(null)).toBe(false);
      expect(isPublicKeyHex(undefined)).toBe(false);
      expect(isPublicKeyHex(123)).toBe(false);
      expect(isPublicKeyHex({ key: "..." })).toBe(false);
      expect(isPublicKeyHex([])).toBe(false);
    });

    it("should reject empty strings", () => {
      expect(isPublicKeyHex("")).toBe(false);
    });

    it("should reject whitespace", () => {
      expect(isPublicKeyHex("   ")).toBe(false);
      expect(
        isPublicKeyHex(" abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789"),
      ).toBe(false);
    });
  });

  describe("Type guard cross-validation (addressing wrong type usage)", () => {
    it("should distinguish contract address from account address", () => {
      const contractAddr = "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4";
      const accountAddr = "GBRPYHIL2CI3WHZDTOOQFC6EB4CGQOFN4L7MRJE47JREUMB5QFO6YL2";

      expect(isContractAddress(contractAddr)).toBe(true);
      expect(isAccountAddress(contractAddr)).toBe(false);

      expect(isContractAddress(accountAddr)).toBe(false);
      expect(isAccountAddress(accountAddr)).toBe(true);
    });

    it("should reject account address where contract is required", () => {
      const accountAddr = "GBRPYHIL2CI3WHZDTOOQFC6EB4CGQOFN4L7MRJE47JREUMB5QFO6YL2";
      expect(isContractAddress(accountAddr)).toBe(false);
    });

    it("should reject contract address where account is required", () => {
      const contractAddr = "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4";
      expect(isAccountAddress(contractAddr)).toBe(false);
    });

    it("should not confuse public key hex with StrKey addresses", () => {
      const publicKeyHex = "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789";
      expect(isStrKeyAddress(publicKeyHex)).toBe(false);
      expect(isPublicKeyHex(publicKeyHex)).toBe(true);
    });
  });

  describe("Edge cases and security", () => {
    it("should reject StrKey addresses with leading/trailing whitespace", () => {
      const validAddr = "GBRPYHIL2CI3WHZDTOOQFC6EB4CGQOFN4L7MRJE47JREUMB5QFO6YL2";
      expect(isStrKeyAddress(` ${validAddr}`)).toBe(false);
      expect(isStrKeyAddress(`${validAddr} `)).toBe(false);
      expect(isStrKeyAddress(` ${validAddr} `)).toBe(false);
    });

    it("should reject hex keys with leading zeros that don't make sense", () => {
      const validHex = "0000000000000000000000000000000000000000000000000000000000000000";
      const invalidPrefix = "00000000000000000000000000000000000000000000000000000000000000000";
      expect(isPublicKeyHex(validHex)).toBe(true);
      expect(isPublicKeyHex(invalidPrefix)).toBe(false);
    });

    it("should be consistent across multiple calls", () => {
      const addr = "GBRPYHIL2CI3WHZDTOOQFC6EB4CGQOFN4L7MRJE47JREUMB5QFO6YL2";
      expect(isAccountAddress(addr)).toBe(isAccountAddress(addr));
      expect(isContractAddress(addr)).toBe(isContractAddress(addr));
    });
  });
});
