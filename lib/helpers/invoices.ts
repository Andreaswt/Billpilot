//==========================================//
//   Helpers and Mappers                    //
//==========================================//

import { ClientStatus, RoundingScheme } from "@prisma/client"

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
      return "2. Decimal"
    case RoundingScheme.POINTPOINTPOINT:
      return "3. Decimal"
  }
}

export const mapStatus = (clientStatusString: string) => {
  let status: ClientStatus = ClientStatus.NOTBILLED
  if (clientStatusString === "billed") status = ClientStatus.BILLED
  if (clientStatusString === "notbilled") status = ClientStatus.NOTBILLED
  return status
}

export const mapStatusToString = (status: ClientStatus) => {
  switch (status) {
    case ClientStatus.NOTBILLED:
      return "Not billed"
    case ClientStatus.BILLED:
      return "Billed"
  }
}