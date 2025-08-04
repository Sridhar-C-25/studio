export type Category = {
  id: string;
  name: string;
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
