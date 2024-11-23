// const puppeteer = require("puppeteer");
import puppeteer from "puppeteer";
import fs from 'fs';

/*
    In Browser which is launched by puppeteer this is the input element

<textarea class="gLFyf" aria-controls="Alh6id" aria-owns="Alh6id" autofocus="" title="Search" value="" jsaction="paste:puy29d;" aria-label="Search" placeholder="" 
aria-autocomplete="both" aria-expanded="false" aria-haspopup="false" autocapitalize="off" autocomplete="off" autocorrect="off"    

id="APjFqb"         maxlength="2048" 
name="q"       role="combobox" rows="1" spellcheck="false" data-ved="0ahUKEwjj6pGb_u-JAxXdbvUHHXGtG6sQ39UDCAY"></textarea>

*/

async function browseWeb(query) {
  console.log("opening web browser");
  console.log("==========================================================================================");
  

  const browser = await puppeteer.launch({ headless: false });

  console.log("browser opend");
  console.log("==========================================================================================");

  const page = await browser.newPage();

  await page.goto("https://www.google.com");

  console.log("waiting for input selector");
  console.log("==========================================================================================");

  await page.waitForSelector("#APjFqb");

  await page.type("#APjFqb", query);
  /*
    await page.type('textarea[name="q"]', query);
  */
  await page.keyboard.press("Enter");

  console.log("query is entered into search box");
  console.log("==========================================================================================");

  await page.waitForSelector("h3");

  const res = await page.evaluate(() => {
    const titles = Array.from(document.querySelectorAll("h3"));
    return titles.slice(0, 5).map((title) => {
      return {
        text: title.innerText,
        link: title.closest("a").href,
      };
    });
  });

  console.log("Search Results");
  console.log("==========================================================================================");
  console.log("==========================================================================================");

  res.forEach((text_link, i) => {
    console.log(`${i + 1}`);
    console.log(`${text_link.text} \n${text_link.link}`);
  });

  console.log("==========================================================================================");

  console.log(
    "Opening Each of the above links and Collecting the infomation . . . "
  );

  //   const contents =  res.map(text_link=> await getContent(browser , text_link.link));
  const contents = [];

  let i = 0;

  for (const text_link of res) {
    if (i == 2) break;
    if (text_link.link) {
      const content = await getContent(browser, text_link.link);
      if(content.length <= 80 ) continue;
      contents.push(content);
    }
    i++;
  }

  await browser.close();

  await saveToFile("content3.txt", contents);


  return contents;
}

async function getContent(browser, link) {
  const page = await browser.newPage();
  await page.goto(link, { waitUntil: "domcontentloaded" });

  await page.waitForSelector("p");

  //   const ps = Array.from(document.querySelectorAll("p"))
  let i = 0;
  const content = await page.evaluate(() => {
    const paragraphs = Array.from(document.querySelectorAll("p"));
    let i = 0;
    let textContent = "";

    for (const p of paragraphs) {
      if (i === 0 || i === 1) {
        // Ignore the first two paragraphs
        i++;
        continue;
      }
    //   if(i == 5) break;
      let innerText = p.innerText.replace(/[\t\n]+/g, '')
      if(innerText.length >= 300) {
        textContent += innerText.slice(0,300);
        i++;
      }
    }

    textContent = textContent.replace(/[\t\n]+/g, '').trim();

    if(textContent.length < 80 ) "";
    
    
    return textContent;
  });

  return content;
}


export async function saveToFile(filename ,  contents) {
    const text = contents.join('\n\n');
    try {
        // Save the contents to a file. 
        fs.writeFileSync(filename, text, { encoding: 'utf8' }); 
        console.log('Contents saved to contents.txt');
      } catch (err) {
        console.error('Error writing to file', err);
      }
}

async function run(query) {
  return await browseWeb(query);
}
// const query = "Summarize the latest trends in AI research.";
// const query = "Give me latest news indian scheams supporting startups";
// run(query);

export default run;
