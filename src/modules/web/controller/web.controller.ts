import { Controller, Get, Param, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import { GardenService } from 'src/modules/garden/service/garden.service'
import { MqttService } from 'src/modules/mqtt/service/mqtt.service'
import handleError from 'src/res/handleError'
import handleRes from 'src/res/handleRes'

@Controller('api')
export class WebController {
    constructor(
        private readonly mqttService: MqttService,
        private readonly gardenService: GardenService,
    ) {}

    @Get('/tasks/get_tasks')
    async getTasks(@Res() res: Response) {
        try {
            const tasks = await this.mqttService.getTasks()
            handleRes(res, tasks)
        } catch (err) {
            handleError(err, res)
        }
    }

    @Get('/agents/get_agents/:task')
    async getAgents(@Res() res: Response, @Param('task') task: string) {
        try {
            const agents = await this.mqttService.getAgentsByTask(task)
            handleRes(res, agents)
        } catch (err) {
            handleError(err, res)
        }
    }

    @Get('/garden/get_plants')
    async getPlants(@Res() res: Response) {
        try {
            const plants = await this.gardenService.getPlants()
            handleRes(res, plants)
        } catch (err) {
            handleError(err, res)
        }
    }

    @Get('/garden/get_metrics')
    async getMetrics(
        @Res() res: Response,
        @Query('limit') limit: number,
        @Query('date') date: string,
        @Query('latest') latest: boolean,
    ) {
        try {
            const metrics = await this.gardenService.getMetrics(
                limit,
                latest,
                date,
            )
            handleRes(res, metrics)
        } catch (err) {
            handleError(err, res)
        }
    }
}
