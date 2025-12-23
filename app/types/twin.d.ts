import type { CSSProp } from 'styled-components'

declare module 'twin.macro' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const styled: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const css: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tw: any
  export default tw
}

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    css?: CSSProp
    tw?: string
  }
}