const Config = {
    port: process.env.PORT ?? 9091,
    sandboxed_mongodb: process.env.SANDBOXED_MONGODB_URI || "",
    sandboxed_collection: process.env.SANDBOXED_COLLECTION,
    default_uid: process.env.DEFAULT_SANDBOX_UID
}


export default Config;