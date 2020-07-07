import {
	ContentObject,
	MediaTypeObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export class ImageResponseContent implements ContentObject {
	[x: string]: MediaTypeObject;

	constructor(...mediaTypes: string[]) {
		mediaTypes.forEach((mediaType) => {
			this[mediaType] = {
				schema: {
					type: 'string',
					format: 'binary',
					example: "File examples aren't supported",
				},
			};
		});
	}
}
