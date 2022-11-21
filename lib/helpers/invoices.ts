//==========================================//
//   Helpers and Mappers                    //
//==========================================//

import { RoundingScheme } from "@prisma/client"

export const mapRoundingScheme = (roundingSchemeString: string) => {
    let roundingScheme: RoundingScheme = RoundingScheme.POINTPOINT
    if (roundingSchemeString === "1. Decimal") roundingScheme = RoundingScheme.POINT
    if (roundingSchemeString === "2. Decimals") roundingScheme = RoundingScheme.POINTPOINT
    if (roundingSchemeString === "3. Decimals") roundingScheme = RoundingScheme.POINTPOINTPOINT
    return roundingScheme
}

export const mapRoundingSchemeToString = (roundingScheme: RoundingScheme) => {
  switch (roundingScheme) {
    case RoundingScheme.POINT:
      return "1. Decimal"
    case RoundingScheme.POINTPOINT:
      return "2. Decimals"
    case RoundingScheme.POINTPOINTPOINT:
      return "3. Decimals"
  }
}
