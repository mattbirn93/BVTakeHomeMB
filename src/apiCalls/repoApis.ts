import axios, { AxiosResponse, CancelTokenSource } from "axios";


const gitHubToken= process.env.EXPO_PUBLIC_GITHUB_TOKEN

export const getRepoList = async (query: string, cancelToken: CancelTokenSource): Promise<AxiosResponse<any>> => {
    try {
        const response = await axios.get(`https://api.github.com/search/repositories?q=${query}&per_page=20`, {
            cancelToken: cancelToken.token, 
            headers: {
                'Authorization': `token ${gitHubToken}`
            }
        });
        return response;
    } catch (error) {
        console.log(`Error fetching repos`, error);
        throw error;
    }
}

export const getRepoLanguages = async (repoFullName: string): Promise<AxiosResponse<any>> => {
    try {
        const url = repoFullName;
        const response = await axios.get(url);
        return response.data;   
    } catch (error) {
        console.log('Error fetching languages:', error);
        throw error;
    }
};
