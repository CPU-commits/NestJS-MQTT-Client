import { Response } from 'express'

export default function (err: any, res: Response) {
    const status = err.status || 500
    res.status(status).json({
        success: false,
        message: err.message,
    })
}
