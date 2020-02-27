export default function isRequired(value) {
  return (value ? undefined : 'Ce champ est obligatoire')
}
