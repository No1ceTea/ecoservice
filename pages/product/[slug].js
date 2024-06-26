import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { toast } from 'react-toastify'
import Layout from '../../components/Layout'
import Product from '../../models/Product'
import db from '../../utils/db'
import { Store } from '../../utils/Store'

export default function ProductScreen(props) {
  const { product } = props
  const { state, dispatch } = useContext(Store)
  const router = useRouter()
  if (!product) {
    return <Layout title="Produt Not Found">Le produit que vous chercher n&apos;existe pas</Layout>
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug)
    const quantity = existItem ? existItem.quantity + 1 : 1
    const { data } = await axios.get(`/api/products/${product._id}`)

    if (data.countInStock < quantity) {
      return toast.error('Désole, ce produit est victime de son succès')
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })
    router.push('/cart')
  }

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">Retourner aux produits</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Catégorie : {product.category}</li>
            <li>Marque : {product.brand}</li>
            <li>
            Évaluation : {product.rating} sur {product.numReviews} évalutation(s)
            </li>
            <li>Description : {product.description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Prix</div>
              <div>{product.price}€</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Statut</div>
              <div>{product.countInStock > 0 ? 'En stock' : 'Indisponible'}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context
  const { slug } = params

  await db.connect()
  const product = await Product.findOne({ slug }).lean()
  await db.disconnect()
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}