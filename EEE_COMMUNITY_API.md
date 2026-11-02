# EEE community examples API

These routes let the EESimulator MAUI client list public community examples and publish a schematic to VendorPort's MongoDB-backed Prisma database.

## Routes

- `GET /api/examples` is public and returns up to 50 published examples, newest first. Each result includes `id`, `title`, `category`, optional `icon` and `formula`, `description`, `componentSummary`, `contentJson`, and `ownerName`.
- `POST /api/examples/token` requires a signed-in VendorPort browser session. It returns a one-time `accessToken` valid for 90 days. Only its SHA-256 hash is stored. Issuing another mobile token revokes the previous one for that account. Copy the returned token to EESimulator Settings; do not share or commit it.
- `POST /api/examples` requires `Authorization: Bearer <accessToken>` and accepts `title`, `category`, `description`, and `contentJson`. It validates native EEE schematic JSON, limits request size, and publishes the example under the authenticated account (up to 10 examples per account per day). Optional `icon`, `formula`, and `componentSummary` fields are accepted as well.

The API never accepts MongoDB credentials from the client. `GET /api/examples` exposes only records marked published and only the owner's display name, not their email or account details.

## Database setup

The new `CommunityExample` and `ApiAccessToken` models are in `prisma/schema.prisma`. Before deploying the new routes, generate the Prisma client and apply the schema to the configured MongoDB database using the project's normal release process. For this MongoDB Prisma datasource, schema synchronization uses `prisma db push`; review the target database and back it up before applying schema changes. The route implementation does not connect to a database at build time.
