import { Currency } from "@prisma/client"

export const formatCurrency = (number: number, currency: Currency) => {
  if (currency === Currency.DKK) return number + "kr"
  if (currency === Currency.USD) "$" + number
  return number + "kr"
}