import Image from 'next/image'
import Link from 'next/link'
import React, { useContext } from 'react'
import { XCircleIcon } from '@heroicons/react/24/outline'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { toast } from 'react-toastify'

function CartScreen() {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const {
    cart: { cartItems },
  } = state;
  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
  };
  const updateCartHandler = async (item, qty) => {
    const quantity = Number(qty)
    const { data } = await axios.get(`/api/products/${item._id}`)
    if (data.countInStock < quantity) {
      return toast.error('Désolé, ce produit est victime de son succès')
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
    toast.success('Produit mis à jour dans le panier')
  };
  return (
    <Layout title="Shopping Cart">
      <h1 className="mb-4 text-xl">Panier</h1>
      {cartItems.length === 0 ? (
        <div>
          La panier est vide. <Link href="/">Aller remplir votre panier !</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full ">
              <thead className="border-b">
                <tr>
                  <th className="p-5 text-left">Item</th>
                  <th className="p-5 text-right">Quantité</th>
                  <th className="p-5 text-right">Prix</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b">
                    <td>
                      <Link href={`/product/${item.slug}`} legacyBehavior>
                        <a className="flex items-center">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          &nbsp;
                          {item.name}
                        </a>
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-right">{item.price} €</td>
                    <td className="p-5 text-center">
                      <button onClick={() => removeItemHandler(item)}>
                        <XCircleIcon className="h-5 w-5"></XCircleIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5">
            <ul>
              <li>
                <div className="pb-3 text-xl">
                  Total ({cartItems.reduce((a, c) => a + c.quantity, 0)}) :
                  {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)} €
                </div>
              </li>
              <li>
                <button
                  onClick={() => router.push('login?redirect=/shipping')}
                  className="primary-button w-full"
                >
                  Valider mon panier
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false })