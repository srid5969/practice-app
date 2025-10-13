
import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { config } from '../configurations/configs';
class ApiService {
    private baseUrl: string;
    private axios: AxiosInstance;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.axios = axios.create({
            baseURL: this.baseUrl,
        });
    }

    public async getBoardsList() {
        const { data: { data, totalCount } } = await this.axios.get('/boards');
        return { data, totalCount };
    }

    public async addNewBoard(boardData: { name: string; owner: string }) {
        const { data } = await this.axios.post('/boards', boardData);
        return data;
    }

}

export const apiService = new ApiService(config.apiBaseUrl)

