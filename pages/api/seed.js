import data from '../../utils/data'
import db from '../../utils/db'
import User from '../../models/User'

const handler = async (req, res) => {
  await db.connect()
  await User.deleteMany()
  await User.insertMany(data.users)
  await db.disconnect()
  res.send({ message: 'seeded succesfully'})
}

export default handler