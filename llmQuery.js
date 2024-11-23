// const axios = require('axios')
import axios from 'axios';

const LLM_ENDPOINT = "http://localhost:1234/v1/chat/completions";

async function queryLLM(prompt){
    try {
        const res = await axios.post(LLM_ENDPOINT , {
            model : "llama-3.2-1b-instruct",
            messages : [{role : "user" , content : prompt}],
            max_tokens : 200
        })
        return res.data.choices[0].message.content;
    } catch (error) {
        console.log("error while quering LLM : " , error.message);
    }
}


async function run(p){

    // const prompt =  "Give me latest news indian scheams supporting startups in short"
    const prompt = `Summarize the provided text into 2-3 concise points. Include all statistics and key information, especially any details related to entrepreneurship :  ${p }`
    const res = await queryLLM(prompt);
    console.log(res);
}


// run();

export default run;
