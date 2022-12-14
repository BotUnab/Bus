// Define "require"
import { createRequire } from "module";
import { staticMapUrl } from 'static-google-map';
const require = createRequire(import.meta.url);
//////////////////////////////////////////////////
const puppeteer = require("puppeteer")
import chromium from 'chrome-aws-lambda';

import { create, Client } from '@open-wa/wa-automate';

async function start(client) {
    client.onMessage(async message=>{
        
        if (message.isGroupMsg && (message.from == "120363026376924076@g.us" || message.from == "120363025695972949@g.us")) {
            if (message.mediaData.type == "sticker"){
                if (message.mediaData.filehash == "P1KLmSE5XrcSBZFxLwVYDBipGjdIavLy+tp01mIyEes="){

                    const url1 = 'http://gpsmobile.co:4000/api/DetalleVehiculo/97141/96365'
                    var ubicacionBus = "";

                    async function start() {
                        const browser = await chromium.puppeteer.launch({
                            args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
                            defaultViewport: chromium.defaultViewport,
                            executablePath: await chromium.executablePath,
                            headless: true,
                            ignoreHTTPSErrors: true,
                          })
                        const page = await browser.newPage()
                        await page.goto(url1)
                        
                        const text = await page.evaluate(() => {
                            return Array.from(document.querySelectorAll("body")).map(x => x.textContent)
                        })
                        //console.log(text[0])
                        ubicacionBus = text[0]
                        
                        function getLat(string) {
                            return string.match(/(?<="Lt":)(.*)(?=,"Lg")/gm); 
                        }
                        
                        function getLon(string) {
                            return string.match(/(?<="Lg":)(.*)(?=,"Vel")/gm); 
                        }
                        
                        const Lat = getLat(ubicacionBus);
                        const Lon = getLon(ubicacionBus);
                        
                        console.log(Lat);
                        console.log(Lon);
                        
                        const chatId = message.from
                        const url = staticMapUrl({
                            key: 'AIzaSyBuq8In3UaBi-OX671gAcOctlY-YF_yIdA',
                            scale: 1,
                            size: '600x600',
                            format: 'png',
                            maptype: 'roadmap',
                            markers: [
                                {
                                    location: { lat: Lat, lng: Lon },
                                    color: 'red',
                                    size: 'mid'
                                }
                            ]})
                        client.sendFileFromUrl(chatId, url, "bus.png", "*Mensaje autom??tico*\nUbicaci??n del bus (aprox.).", message.id)
                        await browser.close()
                    } 
                          
                    start();

                }
            }
    }})
}

create({
  // For Mac:
  //executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  // For Windows:
  executablePath: await chromium.executablePath,
  headless:true,
  qrTimeout: 0,
  authTimeout: 0,
  autoRefresh:true,
  cacheEnabled:false,
  multiDevice: true,
  useChrome: true,
  killProcessOnBrowserClose: true,
  customUserAgent: 'some custom user agent'
})
.then(client => start(client));