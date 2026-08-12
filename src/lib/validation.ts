import { z } from "zod";
import { isValidWalletAddress } from "./wallet";
import { isValidXHandle } from "./x-handle";
import { isValidDiscordUsername } from "./discord-handle";

export const referralSourceSchema = z.enum([
  "x",
  "discord",
  "friend",
  "community",
  "other",
]);

export const simpleApplicationSchema = z
  .object({
    walletAddress: z
      .string()
      .min(1, "Wallet address is required")
      .refine(
        isValidWalletAddress,
        "Enter a valid Ethereum wallet address (0x…)"
      ),
    xHandle: z.string().min(1, "X username is required"),
    discordUsername: z.string().max(32).optional(),
    applicationAnswer: z.string().max(500).optional(),
    signatureDataUrl: z.string().optional(),
    honeypot: z.string().max(0).optional(),
  })
  .superRefine((data, ctx) => {
    if (!isValidXHandle(data.xHandle)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid X handle or profile URL",
        path: ["xHandle"],
      });
    }
    if (
      data.discordUsername?.trim() &&
      !isValidDiscordUsername(data.discordUsername)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid Discord handle (2–32 characters, letters, numbers, _ or .)",
        path: ["discordUsername"],
      });
    }
    if (!data.signatureDataUrl?.startsWith("data:image")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please draw your signature",
        path: ["signatureDataUrl"],
      });
    }
  });

export type SimpleApplicationFormValues = z.infer<
  typeof simpleApplicationSchema
>;

/** Client-side multi-step adoption flow (includes signature + agreement UI fields) */
export const adoptionFlowSchema = z
  .object({
    walletAddress: z
      .string()
      .min(1, "Wallet address is required")
      .refine(
        isValidWalletAddress,
        "Enter a valid Ethereum wallet address (0x…)"
      ),
    xHandle: z.string().min(1, "X username is required"),
    discordUsername: z.string().max(32).optional(),
    applicationAnswer: z.string().max(500).optional(),
    signatureDataUrl: z.string().optional(),
    honeypot: z.string().max(0).optional(),
    agreement: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (!isValidXHandle(data.xHandle)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid X handle or profile URL",
        path: ["xHandle"],
      });
    }
    if (
      data.discordUsername?.trim() &&
      !isValidDiscordUsername(data.discordUsername)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Enter a valid Discord handle (2–32 characters, letters, numbers, _ or .)",
        path: ["discordUsername"],
      });
    }
  });

export const collaborationApplicationSchema = z
  .object({
    collectionName: z.string().min(2, "Collection name is required").max(120),
    website: z
      .string()
      .url("Enter a valid website URL")
      .optional()
      .or(z.literal("")),
    xHandle: z.string().min(1, "X handle is required"),
    discord: z.string().max(64).optional(),
    collectionSize: z.string().max(64).optional(),
    blockchain: z.string().max(64).optional(),
    collaborationPitch: z
      .string()
      .min(20, "Please write at least 20 characters")
      .max(2000),
    spotsRequested: z.coerce.number().int().min(1).max(10000).optional(),
    additionalNotes: z.string().max(1000).optional(),
    dreamCollaborations: z.string().max(1000).optional(),
    honeypot: z.string().max(0).optional(),
  })
  .superRefine((data, ctx) => {
    if (!isValidXHandle(data.xHandle)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid X handle or profile URL",
        path: ["xHandle"],
      });
    }
  });

export type CollaborationApplicationFormValues = z.infer<
  typeof collaborationApplicationSchema
>;

export type AdoptionFlowFormValues = z.infer<typeof adoptionFlowSchema>;

/** @deprecated Use simpleApplicationSchema */
export const whitelistApplicationSchema = simpleApplicationSchema;
export type WhitelistApplicationFormValues = SimpleApplicationFormValues;

export function createApplicationSchema(options: {
  signatureRequired: boolean;
  signatureFallbackEnabled: boolean;
  xRequired: boolean;
  discordRequired: boolean;
  emailRequired: boolean;
  referralEnabled: boolean;
}) {
  return z
    .object({
      walletAddress: z
        .string()
        .min(1, "Wallet address is required")
        .refine(isValidWalletAddress, "Enter a valid Ethereum wallet address (0x…)"),
      xHandle: z.string().optional(),
      discordUsername: z.string().max(100).optional(),
      email: z
        .string()
        .email("Enter a valid email address")
        .optional()
        .or(z.literal("")),
      referralSource: referralSourceSchema.optional(),
      applicationAnswer: z
        .string()
        .min(20, "Please write at least 20 characters")
        .max(1000, "Maximum 1,000 characters"),
      signatureDataUrl: z.string().optional(),
      signatureFallbackName: z.string().max(100).optional(),
      consentWalletOwner: z.literal(true, {
        errorMap: () => ({
          message: "You must confirm wallet ownership",
        }),
      }),
      consentNoGuarantee: z.literal(true, {
        errorMap: () => ({
          message: "You must acknowledge that approval is not guaranteed",
        }),
      }),
      honeypot: z.string().max(0).optional(),
    })
    .superRefine((data, ctx) => {
      if (options.xRequired && !data.xHandle?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "X handle is required",
          path: ["xHandle"],
        });
      }

      if (data.xHandle?.trim() && !isValidXHandle(data.xHandle)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid X handle or profile URL",
          path: ["xHandle"],
        });
      }

      if (options.discordRequired && !data.discordUsername?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discord username is required",
          path: ["discordUsername"],
        });
      }

      if (options.emailRequired && !data.email?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email is required",
          path: ["email"],
        });
      }

      const hasSignature = Boolean(data.signatureDataUrl?.startsWith("data:image"));
      const hasFallback = Boolean(data.signatureFallbackName?.trim());

      if (options.signatureRequired) {
        if (!hasSignature && !(options.signatureFallbackEnabled && hasFallback)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please provide your signature",
            path: ["signatureDataUrl"],
          });
        }
      }
    });
}

export type ApplicationFormValues = z.infer<
  ReturnType<typeof createApplicationSchema>
>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const siteSettingsSchema = z.object({
  applications_open: z.boolean(),
  applications_paused: z.boolean(),
  opening_date: z.string().nullable(),
  closing_date: z.string().nullable(),
  max_submissions: z.number().nullable(),
  allow_duplicate_wallets: z.boolean(),
  signature_required: z.boolean(),
  signature_fallback_enabled: z.boolean(),
  x_field_enabled: z.boolean(),
  x_field_required: z.boolean(),
  discord_field_enabled: z.boolean(),
  discord_field_required: z.boolean(),
  email_field_enabled: z.boolean(),
  email_field_required: z.boolean(),
  referral_field_enabled: z.boolean(),
  checker_enabled: z.boolean(),
  checker_heading: z.string().min(1),
  checker_approved_message: z.string().min(1),
  checker_not_approved_message: z.string().min(1),
  checker_closed_message: z.string().min(1),
  project_name: z.string().min(1),
  project_short_name: z.string().min(1),
  project_tagline: z.string().min(1),
  project_description: z.string().min(1),
  support_email: z.string().email(),
  x_url: z.string(),
  discord_url: z.string(),
  website_url: z.string(),
  announcement_message: z.string().nullable(),
  public_status_wording: z.string(),
  display_timezone: z.string(),
});
