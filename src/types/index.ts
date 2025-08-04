export type Category = {
  id: string;
  name: string;
};

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  status: 'Published' | 'Draft';
  adsenseTag?: string;
};
