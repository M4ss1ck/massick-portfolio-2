import { getPayload } from 'payload'
import config from '@payload-config'

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
        <div>
            <h1>ProjectList</h1>
            {projects.map((project) => (
                <div key={project.id}>
                    <h2>{project.title}</h2>
                </div>
            ))}
        </div>
    )
}
