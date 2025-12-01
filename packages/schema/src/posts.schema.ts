import * as z from 'zod'

export const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(80, 'Title must be 80 characters or less'),
  body: z
    .string()
    .min(1, 'Content is required')
    .max(2000, 'Content must be 2000 characters or less')
    .refine((val) => !['캄보디아', '프놈펜', '불법체류', '텔레그램'].some((word) => val.includes(word)), {
      message: 'Content contains forbidden words'
    }),
  category: z.enum(['NOTICE', 'QNA', 'FREE']),
  tags: z
    .string()
    .refine(
      (val) => {
        const tags = new Set(
          val
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0)
        )
        return tags.size <= 5
      },
      { message: 'Max 5 unique tags allowed' }
    )
    .refine(
      (val) => {
        const tags = val
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
        return tags.every((t) => t.length <= 24)
      },
      { message: 'Each tag must be 24 characters or less' }
    )
})

export type PostFormData = z.infer<typeof postSchema>
