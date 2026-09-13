import { z } from "zod";

export const subscribeSchema = z.object({
  email: z.string().email(),
  turnstileToken: z.string().min(1),
});
