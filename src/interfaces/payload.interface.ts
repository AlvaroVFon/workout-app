export interface Payload {
  id: string
  name: string
  email: string
  idDocument: string
  type?: 'access' | 'refresh'
}
