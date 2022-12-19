// import { Inter } from '@next/font/google'
import Layout from '../components/Layout'
import Productitem from '../components/ProductItem'
import data from '../utils/data'

// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <Layout title="HomePage">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {data.products.map((product) => (
          <Productitem product={product} key={product.slug}></Productitem>
        ))}
      </div>
    </Layout>
  );
}
