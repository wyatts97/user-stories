export interface StoryAttributes {
  id: number;
  userId: number;
  title: string;
  mediaUrl: string;
  imgUrl: string;
  cta: string;
  username: string;
  contentIcon: string;
  contentText: string;
  contentCta: string;
  contentLink: string;
  caption: string;
  mediaType: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Story {
  type: 'stories';
  id: string;
  attributes: StoryAttributes;
}

export interface UserStoryGroup {
  user: any;
  stories: any[];
}

export interface ApiStoryResponse {
  links: {
    first?: string;
    last?: string;
    next?: string;
    prev?: string;
  };
  data: {
    type: string;
    id: string;
    attributes: StoryAttributes;
  }[];
  meta: {
    total: number;
    totalPages: number;
  };
}

export interface FollowingStoriesResponse {
  data: {
    type: string;
    id: string;
    attributes: StoryAttributes;
    relationships?: {
      user?: {
        data: { type: string; id: string };
      };
    };
  }[];
  included?: any[];
}
