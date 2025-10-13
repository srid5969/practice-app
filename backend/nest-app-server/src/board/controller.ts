import { Controller, Get, Query } from '@nestjs/common';
import { BoardService } from './services/board.service';
import { QueryParams } from 'src/common/dtos/query-params.dto';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  async getBoards(
    @Query()
    params: QueryParams,
  ) {
    const data = await this.boardService.listBoards(params);
    return data;
  }
}
