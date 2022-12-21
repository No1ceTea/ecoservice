// import { Inter } from '@next/font/google'
import axios from 'axios'
import { useContext } from 'react'
import { toast } from 'react-toastify'
import Layout from '../components/Layout'
import Productitem from '../components/ProductItem'
import Product from '../models/Product'
import db from '../utils/db'
import { Store } from '../utils/Store'

// const inter = Inter({ subsets: ['latin'] })

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store)
  const { cart } = state

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug)
    const quantity = existItem ? existItem.quantity + 1 : 1
    const { data } = await axios.get(`/api/products/${product._id}`)

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock')
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })

    toast.success('Product added to the cart')

  }

  return (
    <Layout title="HomePage">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <Productitem product={product} key={product.slug} addToCartHandler={addToCartHandler}></Productitem>
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect()
  const products = await Product.find().lean()
  return {
    props: {
      products: products.map(db.convertDocToObj),
    }
  }
}