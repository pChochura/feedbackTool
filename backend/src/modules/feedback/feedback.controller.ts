import { Controller, Body, Res, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiOkResponse } from "@nestjs/swagger";
import { Response } from "express";
import { FeedbackService } from "./feedback.service";
import { sendError, sendResponse } from "../../common";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { BasicResponseSchema } from "../../common/basic-response.schema";

@ApiTags('Feedback')
@Controller('api/v1/feedback')
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) {}

    @Post()
    @ApiOperation({ summary: 'Sends feedback' })
    @ApiOkResponse({
        description: 'Sent feedback',
        schema: new BasicResponseSchema('OK'),
    })
    async send(@Body() createFeedbackDto: CreateFeedbackDto, @Res() response: Response) {
        try {
            await this.feedbackService.send(createFeedbackDto);
            sendResponse(response, { status: 'OK' });
        } catch (error) {
            sendError(response, error);
        }
    }
}