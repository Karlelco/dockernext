import { Private } from './_private/page'
import { RecursivePrivate } from './recursive/_private/page'

export default function Page() {
  return (
    <>
      <Private />
      <RecursivePrivate />
    </>
  )
}
