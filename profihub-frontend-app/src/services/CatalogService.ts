import { catalogApi as api } from '../http';
import { AxiosResponse } from "axios";
import { PostResponse } from "../models/Response/PostResponse";

export default class PostService {
    static async createPost(
        titlе: string,
        experience: string,
        category: string,
        description: string,
        salary: number
    ): Promise<AxiosResponse<PostResponse>> {
        return api.post<PostResponse>(
            '/create-post',
            { titlе, experience, category, description, salary }
        );
    }

    static async readPost(
        link: string
    ): Promise<AxiosResponse<PostResponse>> {
        return api.get<PostResponse>(
            `/watch/${link}`
        );
    } 

    static async updatePost(
        link: string,
        data: Partial<{ title: string; experience: string; category: string; description: string; salary: string }>
    ): Promise<AxiosResponse<PostResponse>> {
        return api.patch<PostResponse>(
            `/update-post/${link}`,
            data
        );
    }

    static async deletePost(
        link: string
    ): Promise<AxiosResponse<void>> {
        return api.delete<void>(
            `/delete-post/${link}`
        );
    }

    static async filterPost(
        category: string
    ): Promise<AxiosResponse<PostResponse[]>> {
        return api.get<PostResponse[]>(
            `/posts-by-category/${category}`
        );
    }

    static async getAllPosts(
    ): Promise<AxiosResponse<PostResponse[]>> {
        return api.get<PostResponse[]>(
            `/all-posts`
        );
    }
}
