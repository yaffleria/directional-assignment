import * as z from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(80, "Title must be 80 characters or less"),
  body: z
    .string()
    .min(1, "Content is required")
    .max(2000, "Content must be 2000 characters or less"),
  category: z.enum(["NOTICE", "QNA", "FREE"]),
  tags: z.string(),
});

export type PostFormData = z.infer<typeof postSchema>;
