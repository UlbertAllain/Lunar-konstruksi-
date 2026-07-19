export interface FAQ {
  id?: string;
  question: string;
  answer: string;
  serviceId?: string;
  order: number;
  isPublished: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
