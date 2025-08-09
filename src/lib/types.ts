export interface FAQ {
  id: number;
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  publish: boolean;
  featured: boolean;
}

export interface Story {
  id: number;
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  descriptionEn: string;
  descriptionAr: string;
  imageUrl: string;
  imageKey: string;
  publish: boolean;
  featured: boolean;
}

export interface CarouselImage {
  id: number;
  uploadthingKey: string;
  src: string;
  captionEn?: string | null;
  captionAr?: string | null;
  altDescription: string;
  order: number;
}

export interface FacebookPostType {
  id: string;
  image: string;
  contentEn: string;
  contentAr: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
  permalink: string;
}

export interface BoardMember {
  id: string;
  nameEn: string;
  nameAr: string;
  imageUrl?: string;
  imageKey?: string;
  bioEn: string;
  bioAr: string;
  type: "board" | "advisor";
  country: "egypt" | "usa" | "all";
}
