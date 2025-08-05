export type Category = {
  id: string;
  name: string;
  postCount?: number;
};

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  category: any;
  createdAt: string;
  status: 'Published' | 'Draft';
  adsenseTag?: string;
};
