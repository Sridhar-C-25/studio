export type Category = {
  id: string;
  name: string;
  postCount?: number;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: Category[];
  createdAt: string;
  status: "Published" | "Draft";
  adsenseTag?: string;
  banner_image?: string;
  src_link?: string;
};
