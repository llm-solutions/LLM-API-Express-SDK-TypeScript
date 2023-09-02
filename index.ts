import axios, { AxiosResponse } from 'axios';

interface Token {
    id: number;
    text: string;
    logprob: number;
    special: boolean;
}

interface Error {
    error: string;
}

interface Line {
    token: Token;
    generated_text: string | null;
}

interface GenerateSyncResponse {
    error?: string;
    generated_text?: string;
}

interface GenerateStreamingResponse {
    error?: string;
    line?: Line;
}

export enum ModelType {
    CORE_MODEL = 'core-model',
}

export class LlmApi {
    base_endpoint = 'https://api.base.place/api/v1';
    api_token: string;

    constructor(api_token: string) {
        this.api_token = api_token;
    }

    public async generate(
        text: string,
        modelType: ModelType = ModelType.CORE_MODEL
    ): Promise<GenerateSyncResponse> {
        const endpoint = this.base_endpoint + '/generate';
        const headers = {
            'x-api-token': this.api_token,
            'Content-Type': 'application/json',
        };
        const data = {
            model: modelType,
            generateType: 'generate',
            input: text,
        };
        try {
            const response = await axios.post(endpoint, data, { headers: headers });
            return response.data;
        } catch (error) {
            return { error: (error as Error).error };
        }
    }

    public async generateStream(
        text: string,
        modelType: ModelType = ModelType.CORE_MODEL,
        onData: (data: GenerateStreamingResponse) => void
    ): Promise<void> {
        const endpoint = this.base_endpoint + '/generate';
        const headers = {
            'x-api-token': this.api_token,
            'Content-Type': 'application/json',
        };
        const data = {
            model: modelType,
            generateType: 'generate_stream',
            input: text,
        };

        const response = await axios.post(endpoint, data, {
            headers: headers,
            responseType: 'stream',
        });
        const stream = response.data;

        stream.on('data', (data: Buffer) => {
            const dataStr = data.toString();
            if(dataStr.includes("data:")) {
                const parsed: GenerateStreamingResponse = {
                    line: JSON.parse(dataStr.replace("data:", "")) as Line
                };
                onData(parsed);
            }
        });
    }
}
