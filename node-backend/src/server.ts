import express, {Request, Response} from 'express';
import puppeteer, {Browser, Page} from "puppeteer";
import cors from "cors";

import Redis from "ioredis";
import * as fs from "fs";
import {readFileSync} from "fs";
import getRedisClient from "./redis";
import {getPuppeteerPage, initParsing} from "./parser";

const app = express();
app.use(cors())

const port = process.env.PORT || 3000;
app.get('/parse', async (req: Request, res: Response) => {
    const redis = getRedisClient()
    await initParsing(req, res);
    const {page} = await getPuppeteerPage()
    const output = []
    for (const link of fs.readFileSync('links.json', 'utf-8').split('\n')) {
        try {
            await page.goto(link, {waitUntil: 'domcontentloaded'});
        } catch (e) {
            continue;
        }
        const content = await page.content();
        if (content.includes(req.query.keyword as string)) {
            output.push(link);
        }
    }
    res.send(output);
    redis.flushall();
    fs.writeFileSync('links.json', '');
})


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});