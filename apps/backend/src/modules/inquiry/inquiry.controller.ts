import { Router, Request, Response } from "express";
import { z } from "zod";
import { InquiryService } from "./inquiry.service";
import { InquiryRepository } from "./inquiry.repository";

export const inquiryRouter = Router();
const inquiryService = new InquiryService(new InquiryRepository());

const CreateInquirySchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.string().email("invalid email"),
  phone: z.string().optional(),
  lineId: z.string().optional(),
  whatsapp: z.string().optional(),
  country: z.string().optional(),
  inquiryType: z
    .enum(["artwork", "custom", "appointment", "corporate", "international"])
    .default("artwork"),
  workId: z.string().optional(),
  budgetRange: z.string().optional(),
  purpose: z.string().optional(),
  message: z.string().min(1, "message is required"),
  needsShipping: z.coerce.boolean().optional(),
  contactPreference: z.string().optional(),
  products: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .optional(),
});

inquiryRouter.post("/", async (req: Request, res: Response) => {
  const body = CreateInquirySchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "Invalid inquiry payload",
      details: body.error.flatten(),
    });
  }

  const { products: _products, ...input } = body.data;
  const result = await inquiryService.createInquiry(input);

  res.status(201).json(result);
});

inquiryRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  if (!id) {
    return res.status(400).json({
      code: "INVALID_ID",
      message: "Invalid inquiry id",
    });
  }

  const inquiry = await inquiryService.getInquiry(id);

  if (!inquiry) {
    return res.status(404).json({
      code: "INQUIRY_NOT_FOUND",
      message: "Inquiry not found",
    });
  }

  res.json(inquiry);
});
