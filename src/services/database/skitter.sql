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
