import { Joi } from 'celebrate';
import { moduleLogger } from '@sliit-foss/module-logger';

const logger = moduleLogger('Config');
class Base {
    static get schema() {
        return {
            PORT: Joi.number().optional(),
            SANDBOXED_MONGODB: Joi.string().required(),
            SANDBOXED_COLLECTION: Joi.string().required(),
            DEFAULT_UID: Joi.string().optional(),
            KEYCLOAK_ENDPOINT: Joi.string().required(),
            KEYCLOAK_ADMIN_CLIENT_SECRET: Joi.string().required(),
            KEYCLOAK_ADAPTER_CONFIG: Joi.string().required(),
        };
    }
    static get values() {
        return {
            PORT: process.env.PORT ?? 2010,
            SANDBOXED_MONGODB: process.env.SANDBOXED_MONGODB_URI || "",
            SANDBOXED_COLLECTION: process.env.SANDBOXED_COLLECTION,
            DEFAULT_UID: process.env.DEFAULT_SANDBOX_UID,
            KEYCLOAK_ENDPOINT: process.env.KEYCLOAK_ENDPOINT,
            KEYCLOAK_ADMIN_CLIENT_SECRET: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET,
            KEYCLOAK_ADAPTER_CONFIG: process.env.KEYCLOAK_ADAPTER_CONFIG,
        };
    }
}

const Config = Base.values;

const { error } = Joi.object(Base.schema).validate(Config);

if (error) {
    logger.error(`Environment validation failed. \nDetails - ${error.details[0].message}\nExiting...`);
    process.exit(1);
}

export default Config;
