import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BoardService } from './services/board.service';
import { QueryParams } from './../common/dtos/query-params.dto';
import { CreateBoardDto } from './dto/board.dto';
import { CommonSuccessResponse } from '../common/constant';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  async getBoards(
    @Query()
    params: QueryParams,
  ) {
    const data = await this.boardService.listBoards(params);
    return {
      ...CommonSuccessResponse,
      data,
    };
  }

  @Post()
  async createBoard(
    @Body() body: CreateBoardDto
  ) {
    const data = await this.boardService.createBoard(body);
    return {
      ...CommonSuccessResponse,
      data,
    };
  }
}
