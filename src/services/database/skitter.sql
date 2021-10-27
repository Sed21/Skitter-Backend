CREATE SCHEMA IF NOT EXISTS "skitter";

SET TIMEZONE = 'Europe/Bucharest';

CREATE TYPE ROLES AS ENUM ('Admin', 'Creator', 'Listener');

CREATE TABLE "skitter".users (
    id uuid PRIMARY KEY,
    username varchar(32) UNIQUE NOT NULL,
    password char(60) NOT NULL,
    signup_date timestamptz NOT NULL DEFAULT NOW(),
    role ROLES NOT NULL DEFAULT 'Listener',
    token char(172),
    token_gen_date timestamptz,
    token_expr_date timestamptz
);

CREATE UNIQUE INDEX username_idx ON "skitter".users (username);
CREATE UNIQUE INDEX token_idx ON "skitter".users (token);
CREATE UNIQUE INDEX id_idx ON "skitter".users (id);

CREATE TABLE "skitter".content (
    content_id uuid PRIMARY KEY,
    book_title varchar(128) NOT NULL,
    book_author varchar(128) NOT NULL,
    review float DEFAULT 0.0,
    description text,
    mime_type varchar(20) NOT NULL,
    upload_date timestamptz NOT NULL DEFAULT NOW(),
    creator_id uuid
);

-- CREATE UNIQUE INDEX content_idx ON "skitter".content (content_id);
-- CREATE UNIQUE INDEX book_title_idx ON "skitter".content (book_title);
-- CREATE UNIQUE INDEX book_author_idx ON "skitter".content (book_author);

-- CREATE TABLE "skitter".reviews (
--     review_id uuid PRIMARY KEY,
--     review_grade float default 0.0 NOT NULL,
--     CONSTRAINT fk_review_user
--         FOREIGN KEY (review_id)
--            REFERENCES users(id)
--            ON DELETE NO ACTION
--
-- );
--
-- CREATE TABLE "skitter".favorites (
--
-- );
--
-- CREATE TABLE "skitter".admin (
--
-- );