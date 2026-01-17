import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetEventsDto {
  @ApiProperty({ example: 50234000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  fromBlock: number;

  @ApiProperty({ example: 50234200 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  toBlock: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page = 1;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit = 5;
}
