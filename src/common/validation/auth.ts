import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(12),
});

export const signUpSchema = loginSchema.extend({
  name: z.string().min(2).max(40),
  organizationName: z.string().min(2).max(40)
});

export const signUpInvitedUserEndpointSchema = z.object({
  name: z.string().min(2).max(40),
  password: z.string().min(4).max(12),
  invitationId: z.string()
});

export const signUpInvitedUserFormSchema = z.object({
  name: z.string().min(2).max(40),
  password: z.string().min(4).max(12),
});

export type ILogin = z.infer<typeof loginSchema>;
export type ISignUp = z.infer<typeof signUpSchema>;
export type ISignUpInvitedUser = z.infer<typeof signUpInvitedUserFormSchema>;