import puppeteer, {Page} from "puppeteer";
import fs from "fs";
import {Request, Response} from 'express';
import getRedisClient from "./redis";


const addLink = async (link: string) => {
    const redis = getRedisClient();
    fs.appendFile('links.json', link + '\n', (err) => {
        redis.set(link, 1);
    })
}

const getPuppeteerPage = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    return {browser, page};
}

const initParsing = async (req: Request, res: Response) => {
    if (req.query.url === undefined) {
        res.send('No url provided')
    }
    if (req.query.keyword === undefined) {
        res.send('No keyword provided')
    }


    const {browser, page} = await getPuppeteerPage();
    const url = req.query.url;
    const keyword = decodeURIComponent(req.query.keyword as string);
    try {
        new URL(url as string);
    } catch (e) {
        res.send('Invalid url');
    }
    await page.setRequestInterception(true);
    page.on('request', request =>
        ['image', 'stylesheet', 'font'].includes(request.resourceType()) ? request.abort() : request.continue())
    if (typeof url === "string" && typeof keyword === "string") {
        await addLink(url)
        await parsePageLinks(url, page, url, keyword);
    }

    await browser.close();
}


const parsePageLinks = async (url: string, page: Page, internal: string, keyword: string) => {
    const redis = getRedisClient();
    try {
        await page.goto(url, {waitUntil: 'domcontentloaded'});
    } catch (e) {
        return
    }
    const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a')).map(anchor => anchor.href)
    });
    for (let link of links) {
        if (!link.includes(internal)) {
            continue;
        }
        if (await redis.get(link) === null) {
            //     console.log(link)
            await addLink(link)
            await parsePageLinks(link, page, internal, keyword);
        }
    }
    return;
}

const checkKeyWord = async (url: string, page: Page, keyword: string) => {
    await page.goto(url, {waitUntil: 'domcontentloaded'});
    const content = await page.content();
    return content.includes(keyword);

}

export {initParsing, addLink, parsePageLinks, checkKeyWord, getPuppeteerPage}