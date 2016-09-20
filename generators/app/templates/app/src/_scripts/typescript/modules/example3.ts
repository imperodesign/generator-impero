export default function (el) {
  let prevNumber = parseInt(el.textContent)
  let newNumber = prevNumber + 1

  el.textContent = newNumber.toString()
}
