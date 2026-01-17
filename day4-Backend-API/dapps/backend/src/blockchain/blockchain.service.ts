import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { createPublicClient, http } from 'viem';
import { avalancheFuji } from 'viem/chains';
import SIMPLE_STORAGE from './simple-storage.json';

@Injectable()
export class BlockchainService {
  private client;
  private contractAddress: `0x${string}`;

  constructor() {
    this.client = createPublicClient({
      chain: avalancheFuji,
      transport: http(
        process.env.FUJI_RPC_URL ??
          'https://api.avax-test.network/ext/bc/C/rpc',
      ),
    });

    this.contractAddress = (process.env.CONTRACT_ADDRESS ??
      '0x84a7e1A42Ca5F7bd72b6849000CA64f0816E523a') as `0x${string}`;
  }

  async getLatestValue() {
    try {
      const value = await this.client.readContract({
        address: this.contractAddress,
        abi: SIMPLE_STORAGE.abi,
        functionName: 'getValue',
      });

      return {
        success: true,
        data: { value: value.toString() },
      };
    } catch (error) {
      throw this.handleRpcError(error);
    }
  }

  async getValueUpdatedEvents(
    fromBlock: number,
    toBlock: number,
    page = 1,
    limit = 10,
  ) {
    if (toBlock < fromBlock) {
      throw new BadRequestException(
        'toBlock tidak boleh lebih kecil dari fromBlock',
      );
    }

    if (toBlock - fromBlock > 1000) {
      throw new BadRequestException(
        'Block range terlalu besar. Maksimal 1000 block.',
      );
    }

    try {
      const events = await this.client.getLogs({
        address: this.contractAddress,
        event: {
          type: 'event',
          name: 'ValueUpdated',
          inputs: [{ name: 'newValue', type: 'uint256', indexed: false }],
        },
        fromBlock: BigInt(fromBlock),
        toBlock: BigInt(toBlock),
      });

      const mapped = events.map((e) => ({
        blockNumber: e.blockNumber?.toString(),
        value: e.args.newValue.toString(),
        txHash: e.transactionHash,
      }));

      return {
        success: true,
        data: mapped.slice((page - 1) * limit, page * limit),
        meta: {
          page,
          limit,
          total: mapped.length,
        },
      };
    } catch (error) {
      throw this.handleRpcError(error);
    }
  }

  // ⚠️ INI HARUS MASIH DI DALAM CLASS
  private handleRpcError(error: any): never {
    console.error('Blockchain RPC Error:', error);
    throw new InternalServerErrorException(
      'Gagal mengambil data dari blockchain',
    );
  }
}
