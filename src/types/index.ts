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
  $updatedAt?: string;
  status: "Published" | "Draft";
  description?: string;
  adsenseTag?: string;
  banner_image?: string;
  src_link?: string;
  keywords?: string;
  tags?: string[];
  views?: number;
  $createdAt?: string;
};
