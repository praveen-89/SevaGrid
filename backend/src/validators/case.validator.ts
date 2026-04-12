import { z } from 'zod';
import { CaseSeverity, CaseStatus } from '../constants';

// Middleware generator to wrap schemas safely against Express requests
export const validate = (schema: z.AnyZodObject) => (req: any, res: any, next: any) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    next(err); // Throws ZodError to Error Middleware
  }
};

export const createCaseSchema = z.object({
  body: z.object({
    title: z.string().min(5, "Title is too short").max(100),
    description: z.string().min(10, "Description required"),
    category: z.string().min(1),
    subcategory: z.string().optional(),
    severity: z.nativeEnum(CaseSeverity).default(CaseSeverity.MEDIUM),
    people_affected: z.number().int().nonnegative().default(0),
    address: z.string().min(5),
    area: z.string().min(2),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    notes: z.string().optional()
  })
});

export const updateCaseStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(CaseStatus),
    note: z.string().optional()
  })
});
