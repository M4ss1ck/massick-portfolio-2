// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { seed } from '@/utils/seed'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tags } from './collections/Tags'
import { Projects } from './collections/Projects'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      title: 'Portfolio',
      description: 'Best Admin Panel in the world',
      titleSuffix: '- Massick',
      icons: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          url: '/icon.svg',
        }
      ]
    },
    avatar: {
      Component: '@/components/payload/Avatar',
    },
    components: {
      graphics: {
        Icon: '@/components/payload/Icon',
        Logo: '@/components/payload/Logo',
      },
      afterNavLinks: [
        '@/components/payload/Home',
      ],
      actions: [
        '@/components/payload/Home',
      ],
    }
  },
  collections: [Users, Media, Tags, Projects],
  localization: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    formBuilderPlugin({
      fields: {
        payment: false,
      },
      formOverrides: {
        fields: undefined,
      },
    }),
  ],
  telemetry: false,
  email: nodemailerAdapter(),
  onInit: async (payload) => {
    if (process.env.PAYLOAD_SEED) {
      await seed(payload)
    }
  },
})
