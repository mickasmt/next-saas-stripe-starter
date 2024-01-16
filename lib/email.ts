import { env } from '@/lib/env.mjs';
import { Resend } from 'resend';

export const resend = new Resend(env.RESEND_API_KEY);