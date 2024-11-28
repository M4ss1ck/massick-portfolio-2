import { getPayload } from 'payload'
import config from '@payload-config'
import { seed } from '@/utils/seed'

const seedData = async () => {
    const payload = await getPayload({ config })
    await seed(payload)
    console.log('Data seeded successfully')
    process.exit()
}

seedData()
