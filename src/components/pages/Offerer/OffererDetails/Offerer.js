export class Offerer {
  constructor(offerer = {}, adminUserOfferer) {
    this.id = offerer.id || undefined // pass-culture-shared awaits undefined to condition the submit method (PATCH vs POST)
    this.siren = offerer.siren || ''
    this.name = offerer.name || ''
    this.address = offerer.address || ''
    this.bic = offerer.bic || ''
    this.iban = offerer.iban || ''
    this.adminUserOfferer = adminUserOfferer
  }

  get areBankInformationProvided () {
    return !!(this.bic && this.iban)
  }
}
