import { LlmApi, ModelType } from "./index";

const run = async () => {
    const apiToken = "YOUR_API_TOKEN";
    const api = new LlmApi(apiToken);


    // Sync response
    const response = await api.generate("What is deep learning, in one sentence?", ModelType.CORE_MODEL);

    if(response.error) {
        console.log("Error:")
        console.log(response.error);
    } else if(response.generated_text) {
        console.log("Generated text:")
        console.log(response.generated_text);
    }


    // Streaming response
    api.generateStream("What is deep learning, in one sentence?", ModelType.CORE_MODEL, (data) => {
        if(data.error) {
            console.log("Error:")
            console.log(data.error);
        } else if(data.line) {
            if(data.line.token.special) {
                // The generated text is only available for the last line
                console.log(data.line.generated_text);
            } else {
                console.log(data.line.token.text);
            }
        }
    });
}

(async () => {
    await run();
})();