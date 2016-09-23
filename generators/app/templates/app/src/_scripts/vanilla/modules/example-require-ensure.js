export default function (el) {
  const prevNumber = parseInt(el.textContent)
  const newNumber = prevNumber + 1

  el.textContent = newNumber.toString()
}
