import { IsString, Length, IsOptional, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateFeedbackDto {
	@IsString()
	@Length(1, 512)
	@ApiProperty({
		required: true,
		description: 'Content of the feedback',
		example: 'Content of the feedback',
	})
    readonly content: string;

    @IsString()
    @IsEmail()
	@IsOptional()
	@Length(1, 32)
	@ApiProperty({
		required: false,
		description: 'Email to the person who send the feedback',
		example: 'anonymous@ft.tech',
	})
	readonly email: string;
}