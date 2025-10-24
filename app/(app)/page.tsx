'use client';

import { getPostsService } from '@/lib/api/post.service';
import { parseLinksSafe } from '@/lib/utils/parse-links-safe';
import { useSocket } from '@/providers/socket-provider';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import WritePost from '@/components/shared/write-post';

export default function Home() {
    const { socket } = useSocket();

    const queryClient = useQueryClient();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ['feed-posts'],
        queryFn: ({ pageParam = 1 }) => getPostsService({ page: pageParam }),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
    });

    // Socket handle new post
    // useEffect(() => {
    //     const handleNewPost = (newPost) => {
    //         queryClient.setQueryData(['feed-posts'], (oldData: any) => {
    //             if(!oldData) return oldData

    //             return [
    //                 ...oldData,
    //             ]
    //         })
    //     };

    //     socket.on('newPost', handleNewPost);

    //     return () => {
    //         socket.off('newPost', handleNewPost);
    //     };
    // }, [socket]);

    const posts = data?.pages.flat();

    return (
        <div className="bg-secondary min-h-full">
            <div className="flex max-w-[1024px] mx-auto relative gap-x-6 pt-2 max-lg:gap-x-3">
                {/* <Sidebar /> */}
                <div className="flex-1 max-md:me-3 max-xs:ms-3">
                    <WritePost />
                    {/* <div className="mt-3">
                        {posts && posts?.length > 0 ? (
                            <>
                                {posts.map((post: PostInfoType) => (
                                    <Post key={`post-${post.postId}`} postInfo={post} />
                                ))}
                                {isNoNewPost && (
                                    <Link
                                        href="/friends/suggestions"
                                        className="text-sm text-primary block text-center underline"
                                    >
                                        Hãy kết bạn thêm để xem nhiều bài viết hơn
                                    </Link>
                                )}
                                <div ref={observerTarget} className="h-20"></div>
                            </>
                        ) : (
                            <Link
                                href="/friends/suggestions"
                                className="text-sm text-primary block text-center underline"
                            >
                                Hãy kết bạn thêm để xem nhiều bài viết hơn
                            </Link>
                        )}
                    </div> */}
                </div>
            </div>
        </div>
    );
}
