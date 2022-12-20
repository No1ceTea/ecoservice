import React from 'react'
import Link from 'next/link'

export default function DrowdownLink(props) {
  let { href, children, ...rest } = props
  return (
    <Link href={href} legacyBehavior>
      <a {...rest}>{children}</a>
    </Link>
  )
}