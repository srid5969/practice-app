import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";



export class CreateBoardDto {
    @IsString()
    @Length(3, 50)
    @IsNotEmpty()
    @ApiProperty({
        description: 'Name of the board',
        minLength: 3,
        maxLength: 50,
        example: 'Project Alpha'
    })
    name: string;

    @IsString()
    @Length(3, 50)
    @IsNotEmpty()
    @ApiProperty({
        description: 'Owner of the board',
        minLength: 3,
        maxLength: 50,
        example: 'john_doe'
    })
    owner: string;
}