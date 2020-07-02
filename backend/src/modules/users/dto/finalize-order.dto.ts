import { IsString, Length, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FinalizeOrderDto {
    @IsString()
    @Length(128, 256)
    @ApiProperty({
        required: true,
        description: 'Token of the transaction',
        example: 'af9bb7f9a757f8d13ea63852f254c12gaf9bb7f9a757f8d13ea63852f254c12gaf9bb7f9a757f8d13ea63852f254c12g',
    })
    readonly token: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        required: false,
        description: 'Indicates if the transaction should be canceled',
        example: false,
        default: false,
    })
    readonly cancel?: boolean = false;
}