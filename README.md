# LLM-API-Express-SDK-TypeScript
SDK for interfacing with LLM API using JavaScript and TypeScript.

## Installation
```bash
npm i llm-models-api
```

## Usage
```typescript
import { LlmApi, ModelType } from "llm-models-api";

// Set your API token
const apiToken = "YOUR_TOKEN";

// Create an instance of the API
const api = new LlmApi(apiToken);


// Fetch Sync response
const response = await api.generate("What is deep learning, in one sentence?", ModelType.CORE_MODEL);

if(response.error) {
    console.log("Error:")
    console.log(response.error);
} else if(response.generated_text) {
    console.log("Generated text:")
    console.log(response.generated_text);
}


// Fetch Streaming response
api.generateStream("What is deep learning, in one sentence?", ModelType.CORE_MODEL, (data) => {
    if(data.error) {
        console.log("Error:")
        console.log(data.error);
    } else if(data.line) {
        if(data.line.token.special) {
            // The generated text is only available for the last line
            console.log(data.line.generated_text);
        } else {
            // Get chunk of generated text
            console.log(data.line.token.text);
        }
    }
});
```