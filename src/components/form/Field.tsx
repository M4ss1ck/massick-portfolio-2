import React from 'react'
import type { Form as FormType } from '@/payload-types'

interface FieldProps {
    field: NonNullable<FormType['fields']>[number] // Use NonNullable to handle null case
    setData: React.Dispatch<React.SetStateAction<object>>
}

const Field: React.FC<FieldProps> = ({ field, setData }) => {
    if (!field) return null;
    if (field.blockType === 'text') {
        return (
            <div
                className='flex flex-col gap-2 px-4 items-start'
                style={{ width: field.width ? `${field.width}%` : 'auto' }}
            >
                <label>{field.label}</label>
                <input
                    type='text'
                    className='block w-full rounded-md bg-transparent px-3 py-1.5 text-base text-secondary outline-1 -outline-offset-1 outline-secondary placeholder:text-other focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6'
                    name={field.name}
                    onChange={(e) => {
                        setData((prevData) => ({
                            ...prevData,
                            [field.name]: e.target.value,
                        }))
                    }}
                />
            </div>
        )
    }
    if (field.blockType === 'email') {
        return (
            <div
                className='flex flex-col gap-2 px-4 items-start'
                style={{ width: field.width ? `${field.width}%` : 'auto' }}
            >
                <label>{field.label}</label>
                <input
                    type='email'
                    className='block w-full rounded-md bg-transparent px-3 py-1.5 text-base text-secondary outline-1 -outline-offset-1 outline-secondary placeholder:text-other focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6'
                    name={field.name}
                    onChange={(e) => {
                        setData((prevData) => ({
                            ...prevData,
                            [field.name]: e.target.value,
                        }))
                    }}
                />
            </div>
        )
    }
    if (field.blockType === 'textarea') {
        return (
            <div
                className='flex flex-col gap-2 px-4'
                style={{ width: field.width ? `${field.width}%` : 'auto' }}
            >
                <label>{field.label}</label>
                <textarea
                    className='block w-full rounded-md bg-transparent px-3 py-1.5 text-base text-secondary outline-1 -outline-offset-1 outline-secondary placeholder:text-other focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6'
                    name={field.name}
                    style={{ resize: 'none' }}
                    onChange={(e) => {
                        setData((prevData) => ({
                            ...prevData,
                            [field.name]: e.target.value,
                        }))
                    }}
                />
            </div>
        )
    }

    return (
        <div>
            <label>{field.blockType}</label>
        </div>
    )
}

export default Field