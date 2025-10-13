import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from '../schemas/board.schema';
import { QueryParams } from 'src/common/dtos/query-params.dto';

@Injectable()
export class BoardService {
  constructor(@InjectModel(Board.name) private boardModel: Model<Board>) {}

  async createBoard(name: string, owner: string): Promise<Board> {
    const newBoard = new this.boardModel({ name, owner });
    const board = await newBoard.save();
    return board;
  }

  async listBoards(
    params: QueryParams,
  ): Promise<{ data: Board[]; totalCount: number }> {
    const page = params?.page || 1;
    const limit = params?.limit || 24;
    const sort = params?.sort || '_id|DESC';
    const skip = page * limit - limit;
    const [sortField, sortOrder] = sort.split('|');

    const data = await this.boardModel
      .find()
      .limit(limit)
      .skip(skip)
      .sort({ [sortField]: sortOrder === 'DESC' ? -1 : 1 });
    const totalCount = await this.boardModel.countDocuments();

    return { data, totalCount };
  }
}
