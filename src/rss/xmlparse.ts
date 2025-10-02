import { error } from 'console';
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser'

type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {

    const response = await fetch(feedURL, {
        headers: {
            'User-Agent': "gator"
        }
    })

    const responseText = await response.text()


    const parse = new XMLParser
    const xmlString = parse.parse(responseText)
    console.log(xmlString)

    if (!xmlString.rss.channel) {
        throw new Error("Rss channel not found")

    }
    if (!xmlString.rss.channel.title || !xmlString.rss.channel.description || !xmlString.rss.channel.link) {
        throw new Error("Data missing in Channel: title,description,link")
    }
    if (!Array.isArray(xmlString.rss.channel.item)) {
        xmlString.rss.channel.item = []
    }

    const extractedItems: RSSItem[] = []
    for (let item of xmlString.rss.channel.item) {

        const itemBuffer: RSSItem = { title: "", link: "", description: "", pubDate: "" }

        if (item.title) {
            itemBuffer.title = item.title
        }
        if (item.link) {
            itemBuffer.link = item.link
        }
        if (item.description) {
            itemBuffer.description = item.description
        }
        if (item.pubDate) {
            itemBuffer.pubDate = item.pubDate
        }
        console.log(itemBuffer)
        extractedItems.push(itemBuffer)
    }
    const feed: RSSFeed = {
        channel: xmlString.rss.channel
    }
    feed.channel.item = extractedItems

    return feed











}