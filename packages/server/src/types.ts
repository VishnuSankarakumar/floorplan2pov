import { z } from 'zod';

export const RenderBody = z.object({
  viewpoint: z.string().min(2).max(120),
  style: z.string().optional()
});
export type RenderBody = z.infer<typeof RenderBody>;