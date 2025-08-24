import { BlogPost, Category } from "@/types";
import { Models } from "node-appwrite";

// helper function to map document to category
export function mapDocumentToCategory(doc: Models.Document): Category {
  return {
    id: doc.$id,
    name: doc.name,
  };
}

// helper function to map document to blog post
export function mapDocumentToBlogPost(
  doc: Models.Document,
  allCategories: Category[]
): BlogPost {
  const categoryIds =
    doc.category?.map((cat: string | { $id: string }) =>
      typeof cat === "string" ? cat : cat.$id
    ) || [];
  const relatedCategories = allCategories.filter((cat) =>
    categoryIds.includes(cat.id)
  );

  return {
    id: doc.$id,
    title: doc.title,
    slug: doc.slug,
    content: doc.content,
    category: relatedCategories,
    createdAt: doc.$createdAt,
    status: doc.status,
    adsenseTag: doc.adsenseTag,
    banner_image: doc.banner_image,
    src_link: doc.src_link,
    keywords: doc.keywords,
  };
}

export function makeSlug(title: string) {
  return title
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\- ]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace to dashes
    .replace(/\-+/g, "-"); // collapse multiple dashes
}
