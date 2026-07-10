import 'dotenv/config';
import mongoose from 'mongoose';
import BookModel from '../../packages/data/models/Book';
async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const book = await BookModel.findOne({ slug: 'class9-social-science' });
  if (!book) { console.log('book not found'); process.exit(1); }
  const err = book.validateSync();
  console.log(err ? '❌ still fails: ' + err.message
    : '✅ book passes Mongoose validation — chapter publish (book.save) will now succeed. subject = ' + book.subject);
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
