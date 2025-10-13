import { Module } from '@nestjs/common';
import { BoardController } from './controller';
import { BoardService } from './services/board.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Board, BoardSchema } from './schemas/board.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]),
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [],
})
export class BoardModule {}
