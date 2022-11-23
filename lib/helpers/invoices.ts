//==========================================//
//   Helpers and Mappers                    //
//==========================================//

import { RoundingScheme } from "@prisma/client"

export const mapRoundingScheme = (roundingSchemeString: string) => {
    let roundingScheme: RoundingScheme = RoundingScheme.POINTPOINT
    if (roundingSchemeString === "1. Decimal") roundingScheme = RoundingScheme.POINT
    if (roundingSchemeString === "2. Decimals") roundingScheme = RoundingScheme.POINTPOINT
    return roundingScheme
}

export const mapRoundingSchemeToString = (roundingScheme: RoundingScheme) => {
  switch (roundingScheme) {
    case RoundingScheme.POINT:
      return "1. Decimal"
    case RoundingScheme.POINTPOINT:
      return "2. Decimals"
  }
}

export const roundHours = (amount: number, roundingScheme: RoundingScheme) => {
  switch (roundingScheme) {
    case RoundingScheme.POINT:
      return Math.round(amount * 10) / 10 
    case RoundingScheme.POINTPOINT:
      return Math.round(amount * 100) / 100
    default:
      return amount
  }
}