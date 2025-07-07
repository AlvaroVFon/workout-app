function generateCode(length: number): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const characters = letters + numbers
  let result = ''

  result += letters[Math.floor(Math.random() * letters.length)]
  result += numbers[Math.floor(Math.random() * numbers.length)]

  for (let i = 2; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }

  return result
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}
export { generateCode }
