import { Response } from 'express'

export default function (err: any, res: Response) {
    const status = err.status || 400
    res.status(status).json({
        success: false,
        message: err.message,
    })
}
