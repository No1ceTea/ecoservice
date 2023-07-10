import React from 'react'
import Link from 'next/link'

export default function Productitem({product, addToCartHandler}) {
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`} legacyBehavior>
        <a>
          <img src={product.image} alt={product.name} className="rounded shadow" />
        </a>
      </Link>

      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`} legacyBehavior>
          <a>
            <h2 className="text-lg">{product.name}</h2>
          </a>
        </Link>
        <p className="mb-2">{product.brand}</p>
        <p>{product.price} €</p>
        <button className="primary-button" type="button" onClick={() => addToCartHandler(product)}>
          Ajouter au panier
        </button>
      </div>
    </div>
  )
}
