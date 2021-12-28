import { search } from "booru";

interface GetBooruImagesOptions {
  tags?: string[];
  limit?: number;
}

export const getBooruImages = async ({
  tags,
  limit = 3,
}: GetBooruImagesOptions = {}) => {
  const { posts } = await search("gelbooru", tags, {
    limit,
    random: true,
  });
  const postUrls = posts
    .map(({ fileUrl }) => fileUrl)
    .filter((url): url is string => !!url);
  return postUrls;
};
