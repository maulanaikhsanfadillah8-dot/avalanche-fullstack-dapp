import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { GetEventsDto } from './dto/get-events.dto';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('value')
  getLatestValue() {
    return this.blockchainService.getLatestValue();
  }

  @Get('events')
  getEvents(@Query() query: GetEventsDto) {
    return this.blockchainService.getValueUpdatedEvents(
      query.fromBlock,
      query.toBlock,
      query.page ?? 1,
      query.limit ?? 10,
    );
  }

  @Post('events')
  async getEventsPost(@Body() body: GetEventsDto) {
    return this.blockchainService.getValueUpdatedEvents(
      body.fromBlock,
      body.toBlock,
      body.page,
      body.limit,
    );
  }
}
