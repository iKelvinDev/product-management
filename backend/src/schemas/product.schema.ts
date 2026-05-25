import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.number().positive("Preço deve ser maior que zero"),
  category: z.string().min(1, "Categoria é obrigatória").max(100),
  active: z.boolean(),
});

export type CreateProductDTO = z.infer<typeof createProductSchema>;