"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const CookieParser = require("cookie-parser");
require('dotenv').config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use(CookieParser('secret'));
    app.enableCors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    });
    const document = swagger_1.SwaggerModule.createDocument(app, new swagger_1.DocumentBuilder()
        .setTitle('FeedbackTool API')
        .setDescription('API for FeedbackTool')
        .setVersion('1.0.0')
        .build());
    swagger_1.SwaggerModule.setup('api/v1/docs', app, document);
    if (!module.parent) {
        await app.listen(8000);
    }
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
//# sourceMappingURL=main.js.map