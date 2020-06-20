import { IsString, Length, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @IsString()
    @IsEmail()
    @Length(4, 32)
    @ApiProperty({
        required: true,
        description: 'Email of the user',
        example: 'anonymous@pointlessapps.tech',
    })
    readonly email: string;

    @IsString()
    @Length(64, 256)
    @ApiProperty({
        required: true,
        description: 'Hashed secret',
        example: 'af9bb7f9a757f8d13ea63852f254c1227b48b9dbb308eae585b3612b61d85ce0',
    })
    readonly secret: string;
}
