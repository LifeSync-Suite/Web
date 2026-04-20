// React Imports
import type { SVGAttributes } from 'react'

const Logo = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg width='1em' height='1em' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <rect width='32' height='32' rx='8' fill='currentColor' />
      <path d='M10 8H14V22H22V26H10V8Z' fill='white' />
    </svg>
  )
}

export default Logo
