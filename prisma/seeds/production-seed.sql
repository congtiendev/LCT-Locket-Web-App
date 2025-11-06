-- ==========================================
-- LOCKET WEB - PRODUCTION SEED DATA
-- Complete mock data for testing
-- ==========================================

-- IMPORTANT: Run this AFTER Prisma migrations
-- Password hashes are bcrypt($2b$10$) of '722003xx'

-- ==========================================
-- 1. USERS (20 test accounts)
-- ==========================================

INSERT INTO users (id, email, password, name, username, avatar, bio, provider, google_id, created_at, updated_at, last_login_at) VALUES

-- Main test account (Email/Password)
('550e8400-e29b-41d4-a716-446655440001', 'congtiendev@gmail.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Công Tiến', 'congtiendev', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400', 'Developer at Locket 🚀', 'email', NULL, NOW() - INTERVAL '90 days', NOW(), NOW() - INTERVAL '2 hours'),

-- Google OAuth accounts
('550e8400-e29b-41d4-a716-446655440002', 'minhanh@gmail.com', NULL, 'Minh Anh', 'minhanh', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', 'Designer & Creative ✨', 'google', 'google_minhanh_123', NOW() - INTERVAL '85 days', NOW(), NOW() - INTERVAL '5 hours'),

('550e8400-e29b-41d4-a716-446655440003', 'hoangnam@gmail.com', NULL, 'Hoàng Nam', 'hoangnam', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400', 'Photographer 📸', 'google', 'google_hoangnam_456', NOW() - INTERVAL '80 days', NOW(), NOW() - INTERVAL '1 day'),

-- Email/Password accounts
('550e8400-e29b-41d4-a716-446655440004', 'thuha@gmail.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Thu Hà', 'thuha', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 'Travel lover 🌏✈️', 'email', NULL, NOW() - INTERVAL '75 days', NOW(), NOW() - INTERVAL '3 hours'),

('550e8400-e29b-41d4-a716-446655440005', 'quanghuy@gmail.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Quang Huy', 'quanghuy', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'Music & Coffee ☕🎵', 'email', NULL, NOW() - INTERVAL '70 days', NOW(), NOW() - INTERVAL '12 hours'),

('550e8400-e29b-41d4-a716-446655440006', 'lanphuong@gmail.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Lan Phương', 'lanphuong', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', 'Foodie & Baker 🍰', 'email', NULL, NOW() - INTERVAL '65 days', NOW(), NOW() - INTERVAL '6 hours'),

('550e8400-e29b-41d4-a716-446655440007', 'ducminh@gmail.com', NULL, 'Đức Minh', 'ducminh', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 'Gym & Fitness 💪', 'google', 'google_ducminh_789', NOW() - INTERVAL '60 days', NOW(), NOW() - INTERVAL '8 hours'),

('550e8400-e29b-41d4-a716-446655440008', 'kimchi@gmail.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Kim Chi', 'kimchi', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', 'Artist 🎨', 'email', NULL, NOW() - INTERVAL '55 days', NOW(), NOW() - INTERVAL '10 hours'),

('550e8400-e29b-41d4-a716-446655440009', 'anhtu@gmail.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Anh Tú', 'anhtu', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', 'Gamer 🎮', 'email', NULL, NOW() - INTERVAL '50 days', NOW(), NOW() - INTERVAL '4 hours'),

('550e8400-e29b-41d4-a716-446655440010', 'mynguyen@gmail.com', NULL, 'My Nguyễn', 'mynguyen', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400', 'Bookworm 📚', 'google', 'google_mynguyen_012', NOW() - INTERVAL '45 days', NOW(), NOW() - INTERVAL '15 hours'),

('550e8400-e29b-41d4-a716-446655440011', 'thanhtung@gmail.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Thanh Tùng', 'thanhtung', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400', 'Streamer 🎬', 'email', NULL, NOW() - INTERVAL '40 days', NOW(), NOW() - INTERVAL '20 hours'),

('550e8400-e29b-41d4-a716-446655440012', 'huyentrang@gmail.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Huyền Trang', 'huyentrang', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400', 'Dancer 💃', 'email', NULL, NOW() - INTERVAL '35 days', NOW(), NOW() - INTERVAL '1 hour'),

('550e8400-e29b-41d4-a716-446655440013', 'baoquoc@gmail.com', NULL, 'Bảo Quốc', 'baoquoc', 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400', 'Entrepreneur 💼', 'google', 'google_baoquoc_345', NOW() - INTERVAL '30 days', NOW(), NOW() - INTERVAL '2 days'),

('550e8400-e29b-41d4-a716-446655440014', 'thuylinh@gmail.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Thuỳ Linh', 'thuylinh', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400', 'Yoga teacher 🧘‍♀️', 'email', NULL, NOW() - INTERVAL '25 days', NOW(), NOW() - INTERVAL '5 hours'),

('550e8400-e29b-41d4-a716-446655440015', 'vanson@gmail.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Văn Sơn', 'vanson', 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400', 'Cyclist 🚴‍♂️', 'email', NULL, NOW() - INTERVAL '20 days', NOW(), NOW() - INTERVAL '3 days'),

('550e8400-e29b-41d4-a716-446655440016', 'phuonganh@gmail.com', NULL, 'Phương Anh', 'phuonganh', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400', 'Fashion blogger 👗', 'google', 'google_phuonganh_678', NOW() - INTERVAL '15 days', NOW(), NOW() - INTERVAL '6 hours'),

('550e8400-e29b-41d4-a716-446655440017', 'minhduc@gmail.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Minh Đức', 'minhduc', 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400', 'Tech reviewer 📱', 'email', NULL, NOW() - INTERVAL '10 days', NOW(), NOW() - INTERVAL '8 hours'),

('550e8400-e29b-41d4-a716-446655440018', 'thanhnhan@gmail.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Thanh Nhàn', 'thanhnhan', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', 'Pet lover 🐶', 'email', NULL, NOW() - INTERVAL '8 days', NOW(), NOW() - INTERVAL '12 hours'),

('550e8400-e29b-41d4-a716-446655440019', 'anhtuan@gmail.com', NULL, 'Anh Tuấn', 'anhtuan', 'https://images.unsplash.com/photo-1489980557514-251d61e3eeb6?w=400', 'Chef 👨‍🍳', 'google', 'google_anhtuan_901', NOW() - INTERVAL '5 days', NOW(), NOW() - INTERVAL '1 day'),

('550e8400-e29b-41d4-a716-446655440020', 'thutrang@gmail.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Thu Trang', 'thutrang', 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400', 'Makeup artist 💄', 'email', NULL, NOW() - INTERVAL '3 days', NOW(), NOW() - INTERVAL '4 hours')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 2. USER SETTINGS (for all users)
-- ==========================================

INSERT INTO user_settings (id, user_id, is_private, allow_friend_photos, notify_friend_request, notify_photo_uploaded, notify_reaction, notify_message, notify_email, theme, language, created_at, updated_at)
SELECT
  gen_random_uuid(),
  id,
  false,
  true,
  true,
  true,
  true,
  true,
  CASE WHEN provider = 'email' THEN true ELSE false END,
  'dark',
  'vi',
  created_at,
  NOW()
FROM users
WHERE NOT EXISTS (
  SELECT 1 FROM user_settings WHERE user_id = users.id
);

-- ==========================================
-- 3. FRIENDSHIPS (Công Tiến có 15 friends)
-- ==========================================

-- Công Tiến's friends (bidirectional)
INSERT INTO friendships (id, user_id, friend_id, is_favorite, nickname, created_at, updated_at) VALUES

-- Friend 1: Minh Anh (Favorite)
('f-001-002', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', true, 'Anh Designer', NOW() - INTERVAL '60 days', NOW()),
('f-002-001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', false, NULL, NOW() - INTERVAL '60 days', NOW()),

-- Friend 2: Hoàng Nam
('f-001-003', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', false, 'Nam Photo', NOW() - INTERVAL '55 days', NOW()),
('f-003-001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', false, NULL, NOW() - INTERVAL '55 days', NOW()),

-- Friend 3: Thu Hà
('f-001-004', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', true, NULL, NOW() - INTERVAL '50 days', NOW()),
('f-004-001', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', false, NULL, NOW() - INTERVAL '50 days', NOW()),

-- Friend 4: Quang Huy
('f-001-005', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', false, NULL, NOW() - INTERVAL '45 days', NOW()),
('f-005-001', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', false, NULL, NOW() - INTERVAL '45 days', NOW()),

-- Friend 5: Lan Phương
('f-001-006', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', false, NULL, NOW() - INTERVAL '40 days', NOW()),
('f-006-001', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', true, NULL, NOW() - INTERVAL '40 days', NOW()),

-- Friend 6: Đức Minh
('f-001-007', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', false, 'Gym Bro', NOW() - INTERVAL '35 days', NOW()),
('f-007-001', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', false, NULL, NOW() - INTERVAL '35 days', NOW()),

-- Friend 7: Kim Chi
('f-001-008', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440008', false, NULL, NOW() - INTERVAL '30 days', NOW()),
('f-008-001', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001', false, NULL, NOW() - INTERVAL '30 days', NOW()),

-- Friend 8: Anh Tú
('f-001-009', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440009', false, 'Tú Gaming', NOW() - INTERVAL '25 days', NOW()),
('f-009-001', '550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440001', false, NULL, NOW() - INTERVAL '25 days', NOW()),

-- Friend 9: My Nguyễn
('f-001-010', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', true, NULL, NOW() - INTERVAL '20 days', NOW()),
('f-010-001', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', false, NULL, NOW() - INTERVAL '20 days', NOW()),

-- Friend 10: Thanh Tùng
('f-001-011', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', false, NULL, NOW() - INTERVAL '18 days', NOW()),
('f-011-001', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', false, NULL, NOW() - INTERVAL '18 days', NOW()),

-- Friend 11: Huyền Trang
('f-001-012', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440012', false, NULL, NOW() - INTERVAL '15 days', NOW()),
('f-012-001', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', false, NULL, NOW() - INTERVAL '15 days', NOW()),

-- Friend 12: Thuỳ Linh
('f-001-014', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', false, NULL, NOW() - INTERVAL '12 days', NOW()),
('f-014-001', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440001', false, NULL, NOW() - INTERVAL '12 days', NOW()),

-- Friend 13: Văn Sơn
('f-001-015', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440015', false, NULL, NOW() - INTERVAL '10 days', NOW()),
('f-015-001', '550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440001', false, NULL, NOW() - INTERVAL '10 days', NOW()),

-- Friend 14: Phương Anh
('f-001-016', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440016', false, NULL, NOW() - INTERVAL '8 days', NOW()),
('f-016-001', '550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440001', false, NULL, NOW() - INTERVAL '8 days', NOW()),

-- Friend 15: Minh Đức
('f-001-017', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440017', false, NULL, NOW() - INTERVAL '5 days', NOW()),
('f-017-001', '550e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440001', false, NULL, NOW() - INTERVAL '5 days', NOW()),

-- Cross friendships (other users)
('f-002-003', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', false, NULL, NOW() - INTERVAL '40 days', NOW()),
('f-003-002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', false, NULL, NOW() - INTERVAL '40 days', NOW()),

('f-004-005', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', true, NULL, NOW() - INTERVAL '35 days', NOW()),
('f-005-004', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', true, NULL, NOW() - INTERVAL '35 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 4. FRIEND REQUESTS (Pending requests)
-- ==========================================

INSERT INTO friend_requests (id, sender_id, receiver_id, status, message, created_at, updated_at, responded_at) VALUES

-- Pending requests to Công Tiến
('req-001', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440001', 'pending', 'Hi Tiến! Làm quen nhé 👋', NOW() - INTERVAL '2 days', NOW(), NULL),
('req-002', '550e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440001', 'pending', 'Add friend nha!', NOW() - INTERVAL '1 day', NOW(), NULL),
('req-003', '550e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440001', 'pending', NULL, NOW() - INTERVAL '5 hours', NOW(), NULL),

-- Accepted (history)
('req-004', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'accepted', 'Kết bạn nào!', NOW() - INTERVAL '61 days', NOW(), NOW() - INTERVAL '60 days'),
('req-005', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'accepted', NULL, NOW() - INTERVAL '56 days', NOW(), NOW() - INTERVAL '55 days'),

-- Rejected (history)
('req-006', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', 'rejected', NULL, NOW() - INTERVAL '10 days', NOW(), NOW() - INTERVAL '9 days')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 5. PHOTOS (50+ photos from friends)
-- ==========================================

INSERT INTO photos (id, user_id, image_url, caption, width, height, file_size, mime_type, is_public, created_at, updated_at) VALUES

-- Công Tiến's photos (last 7 days)
('photo-001', '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1080', 'Good morning! ☀️', 1080, 1920, 245678, 'image/jpeg', true, NOW() - INTERVAL '2 hours', NOW()),
('photo-002', '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1682687221080-5cb261c645cb?w=1080', 'Coffee time ☕', 1080, 1920, 198234, 'image/jpeg', true, NOW() - INTERVAL '1 day', NOW()),
('photo-003', '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1682687221363-72a3d4d70548?w=1080', 'Coding session 💻', 1080, 1920, 312456, 'image/jpeg', true, NOW() - INTERVAL '3 days', NOW()),
('photo-004', '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=1080', 'Late night work 🌙', 1080, 1920, 267890, 'image/jpeg', true, NOW() - INTERVAL '5 days', NOW()),

-- Minh Anh's photos
('photo-005', '550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1682687220199-d0124f48f95b?w=1080', 'Design inspiration ✨', 1080, 1920, 278901, 'image/jpeg', true, NOW() - INTERVAL '3 hours', NOW()),
('photo-006', '550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1682687220945-93f7e5ca5a3e?w=1080', 'New UI concept 🎨', 1080, 1920, 256789, 'image/jpeg', true, NOW() - INTERVAL '1 day', NOW()),
('photo-007', '550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1682687221038-404cb8830901?w=1080', 'Workspace setup 🖥️', 1080, 1920, 289456, 'image/jpeg', true, NOW() - INTERVAL '4 days', NOW()),

-- Hoàng Nam's photos
('photo-008', '550e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1682687220566-5599dbbebf11?w=1080', 'Golden hour 🌅', 1080, 1920, 334567, 'image/jpeg', true, NOW() - INTERVAL '5 hours', NOW()),
('photo-009', '550e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1682687220923-c58b9a4592ae?w=1080', 'City vibes 🏙️', 1080, 1920, 289012, 'image/jpeg', true, NOW() - INTERVAL '2 days', NOW()),
('photo-010', '550e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1682687221073-1e2c31d86a23?w=1080', 'Street photography 📸', 1080, 1920, 301234, 'image/jpeg', true, NOW() - INTERVAL '6 days', NOW()),

-- Thu Hà's photos
('photo-011', '550e8400-e29b-41d4-a716-446655440004', 'https://images.unsplash.com/photo-1682687221175-fd40bbafe6ca?w=1080', 'Beach day 🏖️', 1080, 1920, 401234, 'image/jpeg', true, NOW() - INTERVAL '8 hours', NOW()),
('photo-012', '550e8400-e29b-41d4-a716-446655440004', 'https://images.unsplash.com/photo-1682687221248-3116ba6ab483?w=1080', 'Travel mode ON ✈️', 1080, 1920, 367890, 'image/jpeg', true, NOW() - INTERVAL '3 days', NOW()),
('photo-013', '550e8400-e29b-41d4-a716-446655440004', 'https://images.unsplash.com/photo-1682687221456-8832b37d2eac?w=1080', 'Mountain views ⛰️', 1080, 1920, 389123, 'image/jpeg', true, NOW() - INTERVAL '7 days', NOW()),

-- Quang Huy's photos
('photo-014', '550e8400-e29b-41d4-a716-446655440005', 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=1080', 'Coffee & chill ☕', 1080, 1920, 278456, 'image/jpeg', true, NOW() - INTERVAL '6 hours', NOW()),
('photo-015', '550e8400-e29b-41d4-a716-446655440005', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1080', 'Live music 🎵', 1080, 1920, 345678, 'image/jpeg', true, NOW() - INTERVAL '2 days', NOW()),

-- Lan Phương's photos
('photo-016', '550e8400-e29b-41d4-a716-446655440006', 'https://images.unsplash.com/photo-1464195244916-405fa0a82545?w=1080', 'Fresh baked 🍰', 1080, 1920, 312789, 'image/jpeg', true, NOW() - INTERVAL '10 hours', NOW()),
('photo-017', '550e8400-e29b-41d4-a716-446655440006', 'https://images.unsplash.com/photo-1481070555726-e220f721d03c?w=1080', 'Cooking time 👨‍🍳', 1080, 1920, 298456, 'image/jpeg', true, NOW() - INTERVAL '4 days', NOW()),

-- Đức Minh's photos
('photo-018', '550e8400-e29b-41d4-a716-446655440007', 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=1080', 'Gym grind 💪', 1080, 1920, 267123, 'image/jpeg', true, NOW() - INTERVAL '12 hours', NOW()),
('photo-019', '550e8400-e29b-41d4-a716-446655440007', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1080', 'Leg day 🏋️', 1080, 1920, 289456, 'image/jpeg', true, NOW() - INTERVAL '5 days', NOW()),

-- Kim Chi's photos
('photo-020', '550e8400-e29b-41d4-a716-446655440008', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1080', 'New artwork 🎨', 1080, 1920, 345123, 'image/jpeg', true, NOW() - INTERVAL '15 hours', NOW()),
('photo-021', '550e8400-e29b-41d4-a716-446655440008', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1080', 'Studio vibes ✨', 1080, 1920, 323456, 'image/jpeg', true, NOW() - INTERVAL '6 days', NOW()),

-- Anh Tú's photos
('photo-022', '550e8400-e29b-41d4-a716-446655440009', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1080', 'Gaming setup 🎮', 1080, 1920, 356789, 'image/jpeg', true, NOW() - INTERVAL '18 hours', NOW()),
('photo-023', '550e8400-e29b-41d4-a716-446655440009', 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1080', 'New build 💻', 1080, 1920, 378901, 'image/jpeg', true, NOW() - INTERVAL '7 days', NOW()),

-- My Nguyễn's photos
('photo-024', '550e8400-e29b-41d4-a716-446655440010', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1080', 'Reading corner 📚', 1080, 1920, 267890, 'image/jpeg', true, NOW() - INTERVAL '4 hours', NOW()),
('photo-025', '550e8400-e29b-41d4-a716-446655440010', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1080', 'Book haul 📖', 1080, 1920, 289123, 'image/jpeg', true, NOW() - INTERVAL '3 days', NOW()),

-- Thanh Tùng's photos
('photo-026', '550e8400-e29b-41d4-a716-446655440011', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1080', 'Streaming setup 🎬', 1080, 1920, 334567, 'image/jpeg', true, NOW() - INTERVAL '7 hours', NOW()),
('photo-027', '550e8400-e29b-41d4-a716-446655440011', 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=1080', 'New mic test 🎙️', 1080, 1920, 312456, 'image/jpeg', true, NOW() - INTERVAL '4 days', NOW()),

-- Huyền Trang's photos
('photo-028', '550e8400-e29b-41d4-a716-446655440012', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1080', 'Dance practice 💃', 1080, 1920, 289456, 'image/jpeg', true, NOW() - INTERVAL '9 hours', NOW()),
('photo-029', '550e8400-e29b-41d4-a716-446655440012', 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=1080', 'Performance night 🌟', 1080, 1920, 356789, 'image/jpeg', true, NOW() - INTERVAL '5 days', NOW()),

-- Thuỳ Linh's photos
('photo-030', '550e8400-e29b-41d4-a716-446655440014', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1080', 'Morning yoga 🧘‍♀️', 1080, 1920, 267123, 'image/jpeg', true, NOW() - INTERVAL '11 hours', NOW()),
('photo-031', '550e8400-e29b-41d4-a716-446655440014', 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=1080', 'Meditation time 🕉️', 1080, 1920, 278456, 'image/jpeg', true, NOW() - INTERVAL '6 days', NOW()),

-- More recent photos (last 24 hours)
('photo-032', '550e8400-e29b-41d4-a716-446655440015', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1080', 'Bike ride 🚴‍♂️', 1080, 1920, 312789, 'image/jpeg', true, NOW() - INTERVAL '30 minutes', NOW()),
('photo-033', '550e8400-e29b-41d4-a716-446655440016', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1080', 'OOTD 👗', 1080, 1920, 345678, 'image/jpeg', true, NOW() - INTERVAL '1 hour', NOW()),
('photo-034', '550e8400-e29b-41d4-a716-446655440017', 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1080', 'Tech unboxing 📱', 1080, 1920, 367890, 'image/jpeg', true, NOW() - INTERVAL '90 minutes', NOW()),
('photo-035', '550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1682687221198-88e8f0b1eda0?w=1080', 'Night work 🌃', 1080, 1920, 289456, 'image/jpeg', true, NOW() - INTERVAL '3 hours', NOW()),
('photo-036', '550e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1682687220208-22d7a2543e88?w=1080', 'Sunset shot 🌇', 1080, 1920, 312456, 'image/jpeg', true, NOW() - INTERVAL '4 hours', NOW()),
('photo-037', '550e8400-e29b-41d4-a716-446655440006', 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=1080', 'Dessert time 🧁', 1080, 1920, 278901, 'image/jpeg', true, NOW() - INTERVAL '5 hours', NOW()),
('photo-038', '550e8400-e29b-41d4-a716-446655440009', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1080', 'Gaming stream 🎮', 1080, 1920, 334567, 'image/jpeg', true, NOW() - INTERVAL '6 hours', NOW()),
('photo-039', '550e8400-e29b-41d4-a716-446655440012', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1080', 'Rehearsal 🎭', 1080, 1920, 298456, 'image/jpeg', true, NOW() - INTERVAL '7 hours', NOW()),
('photo-040', '550e8400-e29b-41d4-a716-446655440014', 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1080', 'Sunrise yoga 🌅', 1080, 1920, 267890, 'image/jpeg', true, NOW() - INTERVAL '8 hours', NOW())
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 6. PHOTO REACTIONS
-- ==========================================

INSERT INTO photo_reactions (id, photo_id, user_id, emoji, created_at) VALUES

-- Reactions on Công Tiến's latest photo
('react-001', 'photo-001', '550e8400-e29b-41d4-a716-446655440002', '❤️', NOW() - INTERVAL '1 hour'),
('react-002', 'photo-001', '550e8400-e29b-41d4-a716-446655440003', '🔥', NOW() - INTERVAL '90 minutes'),
('react-003', 'photo-001', '550e8400-e29b-41d4-a716-446655440004', '😍', NOW() - INTERVAL '30 minutes'),
('react-004', 'photo-001', '550e8400-e29b-41d4-a716-446655440006', '✨', NOW() - INTERVAL '45 minutes'),

-- Reactions on Minh Anh's photo
('react-005', 'photo-005', '550e8400-e29b-41d4-a716-446655440001', '😍', NOW() - INTERVAL '2 hours'),
('react-006', 'photo-005', '550e8400-e29b-41d4-a716-446655440003', '✨', NOW() - INTERVAL '1 hour'),
('react-007', 'photo-005', '550e8400-e29b-41d4-a716-446655440004', '🔥', NOW() - INTERVAL '30 minutes'),

-- Reactions on Hoàng Nam's sunset
('react-008', 'photo-008', '550e8400-e29b-41d4-a716-446655440001', '🌅', NOW() - INTERVAL '3 hours'),
('react-009', 'photo-008', '550e8400-e29b-41d4-a716-446655440002', '😮', NOW() - INTERVAL '2 hours'),
('react-010', 'photo-008', '550e8400-e29b-41d4-a716-446655440005', '🔥', NOW() - INTERVAL '1 hour'),

-- More reactions
('react-011', 'photo-011', '550e8400-e29b-41d4-a716-446655440001', '🏖️', NOW() - INTERVAL '5 hours'),
('react-012', 'photo-014', '550e8400-e29b-41d4-a716-446655440001', '☕', NOW() - INTERVAL '4 hours'),
('react-013', 'photo-016', '550e8400-e29b-41d4-a716-446655440001', '😋', NOW() - INTERVAL '8 hours'),
('react-014', 'photo-018', '550e8400-e29b-41d4-a716-446655440001', '💪', NOW() - INTERVAL '10 hours'),
('react-015', 'photo-020', '550e8400-e29b-41d4-a716-446655440001', '🎨', NOW() - INTERVAL '12 hours'),
('react-016', 'photo-024', '550e8400-e29b-41d4-a716-446655440001', '📚', NOW() - INTERVAL '3 hours'),
('react-017', 'photo-028', '550e8400-e29b-41d4-a716-446655440001', '💃', NOW() - INTERVAL '6 hours'),
('react-018', 'photo-030', '550e8400-e29b-41d4-a716-446655440001', '🧘', NOW() - INTERVAL '9 hours'),

-- Cross reactions
('react-019', 'photo-002', '550e8400-e29b-41d4-a716-446655440002', '☕', NOW() - INTERVAL '1 day'),
('react-020', 'photo-002', '550e8400-e29b-41d4-a716-446655440006', '❤️', NOW() - INTERVAL '20 hours'),
('react-021', 'photo-006', '550e8400-e29b-41d4-a716-446655440003', '🎨', NOW() - INTERVAL '1 day'),
('react-022', 'photo-009', '550e8400-e29b-41d4-a716-446655440001', '🏙️', NOW() - INTERVAL '2 days'),
('react-023', 'photo-012', '550e8400-e29b-41d4-a716-446655440005', '✈️', NOW() - INTERVAL '3 days'),
('react-024', 'photo-015', '550e8400-e29b-41d4-a716-446655440001', '🎵', NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 7. CHAT MESSAGES
-- ==========================================

INSERT INTO chats (id, sender_id, receiver_id, message, image_url, is_read, read_at, created_at, updated_at) VALUES

-- Conversation: Công Tiến ↔ Minh Anh (Active)
('chat-001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Tiến ơi!', NULL, true, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '3 hours', NOW()),
('chat-002', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Sao vậy Anh? 😊', NULL, true, NOW() - INTERVAL '1 hour 50 minutes', NOW() - INTERVAL '2 hours 30 minutes', NOW()),
('chat-003', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Xem design mới của mình chưa?', NULL, true, NOW() - INTERVAL '1 hour 45 minutes', NOW() - INTERVAL '2 hours', NOW()),
('chat-004', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Chưa, để mình xem!', NULL, true, NOW() - INTERVAL '1 hour 40 minutes', NOW() - INTERVAL '1 hour 50 minutes', NOW()),
('chat-005', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', NULL, 'https://images.unsplash.com/photo-1682687220199-d0124f48f95b?w=400', true, NOW() - INTERVAL '1 hour 30 minutes', NOW() - INTERVAL '1 hour 35 minutes', NOW()),
('chat-006', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Đẹp quá đi! ❤️✨', NULL, false, NULL, NOW() - INTERVAL '1 hour', NOW()),

-- Conversation: Công Tiến ↔ Thu Hà (Recent)
('chat-007', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Tiến ơi, ảnh mới đẹp quá!', NULL, true, NOW() - INTERVAL '10 hours', NOW() - INTERVAL '12 hours', NOW()),
('chat-008', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'Cảm ơn Hà nhé! 😊', NULL, true, NOW() - INTERVAL '9 hours', NOW() - INTERVAL '10 hours', NOW()),
('chat-009', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Chụp ở đâu vậy?', NULL, false, NULL, NOW() - INTERVAL '8 hours', NOW()),

-- Conversation: Công Tiến ↔ Hoàng Nam (Planning)
('chat-010', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Bro, đi chụp ảnh không?', NULL, true, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '7 hours', NOW()),
('chat-011', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Okee! Khi nào?', NULL, true, NOW() - INTERVAL '5 hours 50 minutes', NOW() - INTERVAL '6 hours 30 minutes', NOW()),
('chat-012', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Chiều nay 5h được không?', NULL, true, NOW() - INTERVAL '5 hours 40 minutes', NOW() - INTERVAL '6 hours', NOW()),
('chat-013', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Được luôn 👍', NULL, false, NULL, NOW() - INTERVAL '5 hours', NOW()),

-- Conversation: Công Tiến ↔ Quang Huy (Coffee)
('chat-014', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Đi cafe không?', NULL, true, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '5 hours', NOW()),
('chat-015', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 'Oki! Chỗ nào?', NULL, false, NULL, NOW() - INTERVAL '3 hours 30 minutes', NOW()),

-- Conversation: Công Tiến ↔ Lan Phương (Food)
('chat-016', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'Tiến ơi, mình làm bánh mới nè!', NULL, true, NOW() - INTERVAL '15 hours', NOW() - INTERVAL '16 hours', NOW()),
('chat-017', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'Để mình qua ăn thử nhaa 😋', NULL, true, NOW() - INTERVAL '14 hours', NOW() - INTERVAL '15 hours', NOW()),
('chat-018', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', NULL, 'https://images.unsplash.com/photo-1464195244916-405fa0a82545?w=400', false, NULL, NOW() - INTERVAL '13 hours', NOW()),

-- Conversation: Công Tiến ↔ My Nguyễn (Books)
('chat-019', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'Tiến đọc sách gì gần đây?', NULL, true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day 2 hours', NOW()),
('chat-020', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'Mình đang đọc về design thinking', NULL, true, NOW() - INTERVAL '23 hours', NOW() - INTERVAL '1 day', NOW()),
('chat-021', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'Hay không? Recommend không? 📚', NULL, false, NULL, NOW() - INTERVAL '22 hours', NOW())
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 8. NOTIFICATIONS (Recent)
-- ==========================================

INSERT INTO notifications (id, user_id, type, title, message, image_url, action_url, action_data, is_read, read_at, created_at, updated_at) VALUES

-- Friend requests (unread)
('notif-001', '550e8400-e29b-41d4-a716-446655440001', 'friend_request', 'Lời mời kết bạn mới', 'Bảo Quốc đã gửi lời mời kết bạn', 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400', '/requests', '{"requestId": "req-001", "senderId": "550e8400-e29b-41d4-a716-446655440013"}', false, NULL, NOW() - INTERVAL '2 days', NOW()),
('notif-002', '550e8400-e29b-41d4-a716-446655440001', 'friend_request', 'Lời mời kết bạn mới', 'Thanh Nhàn đã gửi lời mời kết bạn', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', '/requests', '{"requestId": "req-002", "senderId": "550e8400-e29b-41d4-a716-446655440018"}', false, NULL, NOW() - INTERVAL '1 day', NOW()),
('notif-003', '550e8400-e29b-41d4-a716-446655440001', 'friend_request', 'Lời mời kết bạn mới', 'Anh Tuấn đã gửi lời mời kết bạn', 'https://images.unsplash.com/photo-1489980557514-251d61e3eeb6?w=400', '/requests', '{"requestId": "req-003", "senderId": "550e8400-e29b-41d4-a716-446655440019"}', false, NULL, NOW() - INTERVAL '5 hours', NOW()),

-- Photo reactions (unread)
('notif-004', '550e8400-e29b-41d4-a716-446655440001', 'reaction', 'Phản ứng mới', 'Minh Anh đã thả tim ảnh của bạn', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', '/photo/photo-001', '{"photoId": "photo-001", "emoji": "❤️"}', false, NULL, NOW() - INTERVAL '1 hour', NOW()),
('notif-005', '550e8400-e29b-41d4-a716-446655440001', 'reaction', 'Phản ứng mới', 'Hoàng Nam đã react ảnh của bạn', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400', '/photo/photo-001', '{"photoId": "photo-001", "emoji": "🔥"}', false, NULL, NOW() - INTERVAL '90 minutes', NOW()),
('notif-006', '550e8400-e29b-41d4-a716-446655440001', 'reaction', 'Phản ứng mới', 'Thu Hà đã thả tim ảnh của bạn', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', '/photo/photo-001', '{"photoId": "photo-001", "emoji": "😍"}', false, NULL, NOW() - INTERVAL '30 minutes', NOW()),

-- New messages (unread)
('notif-007', '550e8400-e29b-41d4-a716-446655440001', 'message', 'Tin nhắn mới', 'Minh Anh: Đẹp quá đi! ❤️✨', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', '/chat/550e8400-e29b-41d4-a716-446655440002', '{"chatId": "chat-006", "senderId": "550e8400-e29b-41d4-a716-446655440002"}', false, NULL, NOW() - INTERVAL '1 hour', NOW()),
('notif-008', '550e8400-e29b-41d4-a716-446655440001', 'message', 'Tin nhắn mới', 'Thu Hà: Chụp ở đâu vậy?', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', '/chat/550e8400-e29b-41d4-a716-446655440004', '{"chatId": "chat-009", "senderId": "550e8400-e29b-41d4-a716-446655440004"}', false, NULL, NOW() - INTERVAL '8 hours', NOW()),
('notif-009', '550e8400-e29b-41d4-a716-446655440001', 'message', 'Tin nhắn mới', 'Hoàng Nam: Chiều nay 5h được không?', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400', '/chat/550e8400-e29b-41d4-a716-446655440003', '{"chatId": "chat-012", "senderId": "550e8400-e29b-41d4-a716-446655440003"}', true, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours 30 minutes', NOW()),

-- New photos (unread)
('notif-010', '550e8400-e29b-41d4-a716-446655440001', 'photo_uploaded', 'Ảnh mới từ bạn bè', 'Minh Anh vừa đăng ảnh mới', 'https://images.unsplash.com/photo-1682687220199-d0124f48f95b?w=400', '/photo/photo-005', '{"photoId": "photo-005", "userId": "550e8400-e29b-41d4-a716-446655440002"}', false, NULL, NOW() - INTERVAL '3 hours', NOW()),
('notif-011', '550e8400-e29b-41d4-a716-446655440001', 'photo_uploaded', 'Ảnh mới từ bạn bè', 'Hoàng Nam vừa đăng ảnh mới', 'https://images.unsplash.com/photo-1682687220566-5599dbbebf11?w=400', '/photo/photo-008', '{"photoId": "photo-008", "userId": "550e8400-e29b-41d4-a716-446655440003"}', false, NULL, NOW() - INTERVAL '5 hours', NOW()),
('notif-012', '550e8400-e29b-41d4-a716-446655440001', 'photo_uploaded', 'Ảnh mới từ bạn bè', 'Thu Hà vừa đăng ảnh mới', 'https://images.unsplash.com/photo-1682687221175-fd40bbafe6ca?w=400', '/photo/photo-011', '{"photoId": "photo-011", "userId": "550e8400-e29b-41d4-a716-446655440004"}', true, NOW() - INTERVAL '7 hours', NOW() - INTERVAL '8 hours', NOW()),

-- Older notifications (read)
('notif-013', '550e8400-e29b-41d4-a716-446655440001', 'photo_uploaded', 'Ảnh mới từ bạn bè', 'Quang Huy vừa đăng ảnh mới', 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=400', '/photo/photo-014', '{"photoId": "photo-014", "userId": "550e8400-e29b-41d4-a716-446655440005"}', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 days', NOW()),
('notif-014', '550e8400-e29b-41d4-a716-446655440001', 'reaction', 'Phản ứng mới', 'Lan Phương đã react ảnh của bạn', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', '/photo/photo-002', '{"photoId": "photo-002", "emoji": "❤️"}', true, NOW() - INTERVAL '20 hours', NOW() - INTERVAL '1 day', NOW())
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 9. REFRESH TOKENS (Active sessions)
-- ==========================================

INSERT INTO refresh_tokens (id, user_id, token, expires_at, device_id, device_name, ip_address, user_agent, is_revoked, revoked_at, created_at, updated_at) VALUES

-- Công Tiến's active sessions
('token-001', '550e8400-e29b-41d4-a716-446655440001', 'refresh_token_tien_iphone_001', NOW() + INTERVAL '30 days', 'device-iphone-001', 'iPhone 15 Pro Max', '192.168.1.100', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', false, NULL, NOW() - INTERVAL '2 hours', NOW()),
('token-002', '550e8400-e29b-41d4-a716-446655440001', 'refresh_token_tien_macbook_002', NOW() + INTERVAL '30 days', 'device-mac-001', 'MacBook Pro 14"', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', false, NULL, NOW() - INTERVAL '1 day', NOW()),

-- Other users' sessions
('token-003', '550e8400-e29b-41d4-a716-446655440002', 'refresh_token_anh_samsung_003', NOW() + INTERVAL '30 days', 'device-samsung-002', 'Samsung Galaxy S24 Ultra', '192.168.1.102', 'Mozilla/5.0 (Linux; Android 14)', false, NULL, NOW() - INTERVAL '5 hours', NOW()),
('token-004', '550e8400-e29b-41d4-a716-446655440003', 'refresh_token_nam_iphone_004', NOW() + INTERVAL '30 days', 'device-iphone-003', 'iPhone 14 Pro', '192.168.1.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)', false, NULL, NOW() - INTERVAL '1 day', NOW()),

-- Revoked tokens (logged out)
('token-005', '550e8400-e29b-41d4-a716-446655440001', 'refresh_token_tien_ipad_005_revoked', NOW() + INTERVAL '30 days', 'device-ipad-001', 'iPad Pro 12.9"', '192.168.1.104', 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '10 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- ✅ SEED DATA COMPLETE!
-- ==========================================

-- Summary:
-- ✅ 20 users (mix of email & Google OAuth)
-- ✅ 20 user settings (auto-generated)
-- ✅ 32 friendships (16 pairs, Công Tiến has 15 friends)
-- ✅ 6 friend requests (3 pending, 2 accepted, 1 rejected)
-- ✅ 40 photos (distributed across users, last 7 days)
-- ✅ 24 photo reactions (various emojis)
-- ✅ 21 chat messages (7 conversations)
-- ✅ 14 notifications (9 unread, 5 read)
-- ✅ 5 refresh tokens (4 active, 1 revoked)

-- Test credentials:
-- Email: congtiendev@gmail.com
-- Password: 722003xx
-- User ID: 550e8400-e29b-41d4-a716-446655440001
