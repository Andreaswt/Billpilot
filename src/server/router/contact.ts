import { ApiKeyProvider } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import * as trpc from '@trpc/server';
import { createRouter } from "./context";
import { z } from "zod";
import * as nodemailer from 'nodemailer'

export const contactRouter = createRouter()

    .mutation("sendmail", {
        input: z.object({
            name: z.string(),
            company: z.string(),
            email: z.string(),
            phone: z.string(),
            message: z.string(),

        }),

        async resolve({ input, ctx }) {

            var transporter = nodemailer.createTransport({
                host: 'mail.privateemail.com',
                port: 465,
                auth: {
                    user: 'contact@billpilot.io',
                    pass: 'z@uZeNvWj.BX7P9'
                },
                secure: true,
            });

            var mailOptions = {
                from: 'contact@billpilot.io',
                to: 'contact@billpilot.io',
                subject: 'Contact Form',
                text: `Name: ${input.name}\nCompany: ${input.company}\nEmail: ${input.email}\nPhone: ${input.phone}\nMessage: ${input.message}`
            };

            transporter.sendMail(mailOptions, function (error: any, info: { response: string; }) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

        },

    });
