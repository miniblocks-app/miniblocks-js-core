import express from "express";

function healthCheck(req: express.Request, res: express.Response) {
    res.json({
        message: "Server is just fine. thanks for checking. 😘",
        time: new Date().toISOString()
    })
}

export { healthCheck };


