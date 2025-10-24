import { CreatePostDto, PostInfoType } from '@/types/post';
import apiClient from './api-client';
import { QueryListType } from '@/types/common';

const prefix = '/api/posts';

export const getPostsService = ({ page, limit = 5 }: QueryListType) => {
    return apiClient.get<any, PostInfoType[]>(prefix, {
        params: { page, limit },
    });
};

export const createPostService = (data: CreatePostDto) => {
    return apiClient.post(prefix, data);
};
