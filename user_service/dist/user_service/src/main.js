"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    const port = config.get('port') ?? 3000;
    const prefix = config.get('apiPrefix') ?? 'api/v1';
    const nodeEnv = config.get('nodeEnv') ?? 'development';
    app.setGlobalPrefix(prefix);
    app.enableCors({
        origin: nodeEnv === 'production' ? process.env.ALLOWED_ORIGINS?.split(',') : '*',
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    if (nodeEnv !== 'production') {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle('NestJS Auth API')
            .setDescription('Production-level User Authentication API built with NestJS & TypeScript')
            .setVersion('1.0')
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter your JWT access token',
        }, 'JWT-auth')
            .addTag('Auth', 'Authentication endpoints')
            .addTag('Users', 'User management endpoints')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup(`${prefix}/docs`, app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                tagsSorter: 'alpha',
            },
        });
        logger.log(`📚 Swagger docs → http://localhost:${port}/${prefix}/docs`);
    }
    await app.listen(port);
    logger.log(`🚀 Server running on http://localhost:${port}/${prefix}`);
    logger.log(`🌍 Environment: ${nodeEnv}`);
}
bootstrap();
//# sourceMappingURL=main.js.map