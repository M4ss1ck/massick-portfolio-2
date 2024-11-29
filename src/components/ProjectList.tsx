import { getPayload } from 'payload'
import config from '@payload-config'
import { Card } from './Card'

export const ProjectList = async () => {
    const payload = await getPayload({ config })

    const rawProjects = await payload.find({
        collection: 'projects',
        depth: 2,
        sort: "-publishedDate",
        limit: 100,
    })
    const projects = rawProjects.docs
    return (
        <div className='grid grid-cols-1 gap-2 space-y-2 py-4'>
            {projects.map((project) => (
                <Card key={project.id} project={project} />
            ))}
        </div>
    )
}
