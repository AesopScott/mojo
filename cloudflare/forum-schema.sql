CREATE TABLE IF NOT EXISTS forum_categories (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS forum_threads (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_token_hash TEXT NOT NULL,
  youtube_url TEXT,
  youtube_video_id TEXT,
  youtube_thumbnail_url TEXT,
  image_url TEXT,
  poll_question TEXT,
  pinned INTEGER NOT NULL DEFAULT 0,
  locked INTEGER NOT NULL DEFAULT 0,
  hidden INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES forum_categories(id)
);

CREATE TABLE IF NOT EXISTS forum_posts (
  id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL,
  body TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_token_hash TEXT NOT NULL,
  youtube_url TEXT,
  youtube_video_id TEXT,
  youtube_thumbnail_url TEXT,
  image_url TEXT,
  hidden INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (thread_id) REFERENCES forum_threads(id)
);

CREATE TABLE IF NOT EXISTS forum_poll_options (
  id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (thread_id) REFERENCES forum_threads(id)
);

CREATE TABLE IF NOT EXISTS forum_poll_votes (
  thread_id TEXT NOT NULL,
  option_id TEXT NOT NULL,
  voter_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (thread_id, voter_hash),
  FOREIGN KEY (thread_id) REFERENCES forum_threads(id),
  FOREIGN KEY (option_id) REFERENCES forum_poll_options(id)
);

CREATE TABLE IF NOT EXISTS forum_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_login_at TEXT
);

CREATE TABLE IF NOT EXISTS forum_login_codes (
  email TEXT PRIMARY KEY,
  code_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS forum_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES forum_users(id)
);

CREATE INDEX IF NOT EXISTS idx_forum_threads_category_updated
  ON forum_threads(category_id, hidden, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_forum_posts_thread_created
  ON forum_posts(thread_id, hidden, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_forum_votes_option
  ON forum_poll_votes(option_id);

CREATE INDEX IF NOT EXISTS idx_forum_sessions_token
  ON forum_sessions(token_hash, expires_at);

DELETE FROM forum_categories WHERE slug = 'support';
DELETE FROM forum_categories WHERE slug = 'events';

INSERT INTO forum_categories (id, slug, name, description, sort_order, created_at)
VALUES
  ('cat-general', 'general', 'General', 'Open conversation, questions, and community notes.', 10, '2026-07-03T00:00:00.000Z'),
  ('cat-introductions', 'introductions', 'Introductions', 'Say hello, share what you are building, and meet the community.', 20, '2026-07-03T00:00:00.000Z'),
  ('cat-valuable-videos', 'valuable-videos', 'Valuable Videos', 'Share useful YouTube videos, talks, walkthroughs, and learning resources.', 30, '2026-07-03T00:00:00.000Z'),
  ('cat-maps', 'maps', 'Maps', 'MAPS training, operating-model questions, and role architecture discussion.', 40, '2026-07-03T00:00:00.000Z'),
  ('cat-builds', 'builds', 'Builds', 'Share AI builds, experiments, demos, and lessons learned.', 50, '2026-07-03T00:00:00.000Z'),
  ('cat-meetup', 'meetup', 'Meetup', 'Meetups, workshops, watch sessions, and follow-up threads.', 60, '2026-07-03T00:00:00.000Z'),
  ('cat-projects', 'projects', 'Projects', 'Share project work, collaboration requests, and build progress.', 70, '2026-07-03T00:00:00.000Z'),
  ('cat-self-promote', 'self-promote', 'Self Promote', 'Share your work, offers, launches, and public wins.', 80, '2026-07-03T00:00:00.000Z'),
  ('cat-skills', 'skills', 'Skills', 'Discuss skills, templates, workflows, and practical capability building.', 90, '2026-07-03T00:00:00.000Z')
ON CONFLICT(slug) DO UPDATE SET
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;
