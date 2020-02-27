const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

export default function isValidEmail(email) {
  return (EMAIL_REGEX.test(email) ? undefined : 'Veuillez saisir une adresse email valide')
}
