export default function (el) {
  const prevNumber = Number(el.textContent)
  const newNumber = prevNumber + 1

  el.textContent = newNumber.toString()
}
