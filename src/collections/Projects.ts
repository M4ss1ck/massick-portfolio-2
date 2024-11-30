import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
    slug: 'projects',
    admin: {
        useAsTitle: 'title',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            label: 'Title',
            type: 'text',
            required: true,
        },
        {
            name: 'description',
            label: 'Description',
            type: 'textarea',
        },
        {
            name: 'url',
            label: 'URL',
            type: 'text',
        },
        {
            name: 'coverImage',
            label: 'Cover Image',
            type: 'upload',
            relationTo: 'media',
            required: false,
        },
        {
            name: 'demo',
            label: 'Demo',
            type: 'text',
        },
        {
            name: 'tags',
            label: 'Tags',
            type: 'relationship',
            relationTo: 'tags',
            hasMany: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'publishedDate',
            type: 'date',
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'isFavorite',
            label: 'Favorite',
            type: 'checkbox',
            defaultValue: false,
        },
        {
            name: 'relatedProjects',
            type: 'relationship',
            relationTo: 'projects',
            hasMany: true,
            admin: {
                position: 'sidebar',
            },
            filterOptions: ({ id }) => {
                return {
                    id: {
                        not_in: [id],
                    },
                }
            },
        },
    ],
}