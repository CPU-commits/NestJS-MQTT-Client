import { Response } from 'express'

export default function (res: Response, body?: any) {
    res.json({
        success: true,
        body,
    })
}
