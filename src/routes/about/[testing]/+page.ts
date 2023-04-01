import type { PageLoad } from './$types'

export const load: PageLoad = ({ params }) => {
  return {
    test: params.testing
  }
}