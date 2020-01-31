
import User from '../server/models/userModel';

/**
 * Make any changes you need to make to the database here
 */
async function up () {
  // Write migration here
  try{
    await User.create({ email: 'mepineda1992@gmail.com', password: '1234', role:'admin'  })

  } catch(error) {
    console.log(error);
  }
  const users = await User.find();
  console.log(users);
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  // Write migration here
}

export default { up, down };
