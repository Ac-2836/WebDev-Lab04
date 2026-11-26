import { Profile } from './models.js';

const PROFILES = [
  ['p-an', 'An', 24, 'Thích cà phê muối và đi bộ ở Hồ Gươm.'],
  ['p-binh', 'Bình', 26, 'Dev frontend, rảnh là ngồi sửa CSS.'],
  ['p-chi', 'Chi', 23, 'Đi concert một mình cũng vui.'],
  ['p-dung', 'Dũng', 27, 'Rep tin nhắn sau 3 ngày nhưng rất chân thành.'],
  ['p-giang', 'Giang', 25, 'Hẹn đi ăn rồi lại bận đột xuất.'],
  ['p-hoa', 'Hoa', 22, 'Đang tìm người chịu nghe podcast cùng.'],
  ['p-khoa', 'Khoa', 28, 'Gym 6 buổi một tuần, nấu ăn ngon.'],
  ['p-linh', 'Linh', 24, 'Seen là có đọc, rep hay không thì tùy.'],
];

// Idempotent: safe to run on every server start.
export async function seedProfiles() {
  await Profile.bulkWrite(
    PROFILES.map(([_id, name, age, bio], order) => ({
      updateOne: {
        filter: { _id },
        update: { $set: { name, age, bio, order } },
        upsert: true,
      },
    }))
  );
  return PROFILES.length;
}
