export declare const appConfig: () => {
    nodeEnv: string;
    port: number;
    apiPrefix: string;
    database: {
        url: string | undefined;
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
        synchronize: boolean;
        logging: boolean;
    };
    jwt: {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    bcrypt: {
        saltRounds: number;
    };
};
export type AppConfig = ReturnType<typeof appConfig>;
