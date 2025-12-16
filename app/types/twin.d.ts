import type { CSSProp, default as styled, css } from 'styled-components'

declare module 'twin.macro' {
  export const styled: typeof styled
  export const css: typeof css
  const tw: typeof css
  export default tw
}

declare module 'react' {
  import type { CSSProp } from 'styled-components'
  
  interface HTMLAttributes<T> {
    css?: CSSProp
    tw?: string
  }
}