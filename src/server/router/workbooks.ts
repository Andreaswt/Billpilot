import { Currency } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { formatCurrency } from "../../../lib/helpers/currency";
import { activities, organisations, tasks, test } from "../../../lib/integrations/workbooks";
import { createRouter } from "./context";

export const workbooksRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    const organizationId = ctx.session?.user.organizationId;

    if (!organizationId) {
      throw new TRPCError({ message: "User not found", code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, organizationId } })
  })
  .mutation("test", {
    input: z
      .object({
        invoicedDatesFrom: z.date(),
        invoicedDatesTo: z.date(),
      }),
    async resolve({ input, ctx }) {
      return {
        clients: [
          {
            name: "Maersk",
            budgetedHours: 10,
            budget: formatCurrency(300, Currency.GBP),
            hoursTracked: 17,
            cost: formatCurrency(500, Currency.GBP),
            overUnderBudget: formatCurrency(200, Currency.GBP),
            jobs: [{
              name: "nov.2022",
              budgetedHours: 10,
              budget: formatCurrency(300, Currency.GBP),
              hoursTracked: 17,
              cost: formatCurrency(500, Currency.GBP),
              overUnderBudget: formatCurrency(200, Currency.GBP),
              employees: [{
                budgetedHours: 10,
                budget: formatCurrency(300, Currency.GBP),
                hoursTracked: 17,
                cost: formatCurrency(500, Currency.GBP),
                overUnderBudget: formatCurrency(200, Currency.GBP),
                name: "John Doe",
              },
              {
                budgetedHours: 50,
                budget: formatCurrency(700, Currency.GBP),
                hoursTracked: 75,
                cost: formatCurrency(1000, Currency.GBP),
                overUnderBudget: formatCurrency(300, Currency.GBP),
                name: "Jane Johnsen",
              }]
            },
            {
              name: "nov.2022",
              budgetedHours: 10,
              budget: formatCurrency(300, Currency.GBP),
              hoursTracked: 17,
              cost: formatCurrency(500, Currency.GBP),
              overUnderBudget: formatCurrency(200, Currency.GBP),
              employees: [{
                budgetedHours: 10,
                budget: formatCurrency(300, Currency.GBP),
                hoursTracked: 17,
                cost: formatCurrency(500, Currency.GBP),
                overUnderBudget: formatCurrency(200, Currency.GBP),
                name: "John Doe",
              },
              {
                budgetedHours: 50,
                budget: formatCurrency(700, Currency.GBP),
                hoursTracked: 75,
                cost: formatCurrency(1000, Currency.GBP),
                overUnderBudget: formatCurrency(300, Currency.GBP),
                name: "Jane Johnsen",
              }]
            }]
          }
        ]
      }
    },
  })