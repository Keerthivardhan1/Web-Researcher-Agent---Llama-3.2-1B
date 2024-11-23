import QueryLLM from './llmQuery.js'
import BrowseWeb, { saveToFile } from './browseAutomation.js'
// import readline from 'readline'

// const rd = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// let task = "";

//  rd.question('What is my work : ', name => {
//     task = name;
//     readline.close();
//   });

async function agent(task) {
    const contents = await BrowseWeb(task);

    console.log("Summarizing the information . . . ");
    console.log("==========================================================================================");

    // const res = contents.map(async content=> await QueryLLM(content))

    let res = "";

    for (const cont of contents) {
        const chunks = splitIntoChunks(cont, chunkSize);

        let i=0;
        
        for (const chunk of chunks) {
          if(i >= 11) break;
          let temp = await QueryLLM(`summarize this in to 1 to 2 points, include statistics ${chunk}`); // Simulating appending LLM response for now
          if(!temp) res += temp;
          res += '\n';
          i++;
        }
      }

    // console.log("contens : ", contents);


    console.log(res);
    
    await saveToFile("Result.txt" , [res]);
}

const chunkSize = 1000;

function splitIntoChunks(content, chunkSize) {
    const chunks = [];
    let i = 0;
    while (i < content.length) {
      chunks.push(content.slice(i, i + chunkSize));
      i += chunkSize;
    }
    return chunks;
  }
  
console.log("==================Provide me with the latest news on entrepreneurial schemes in India.==================");


await agent("Provide me with the latest news on entrepreneurial schemes in India.")

console.log("==========================================================================================");