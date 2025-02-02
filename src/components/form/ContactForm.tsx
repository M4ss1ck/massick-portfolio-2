"use client"
import React, { useState, useEffect } from 'react'
import { Loading } from '../icons/Loading'
import type { Form as FormType } from '@/payload-types'
import Field from './Field'

const ContactForm = () => {
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState<FormType | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<Record<string, any>>({})
    const [isDisabled, setIsDisabled] = useState(false)
    const fetchForm = async (id: number | string) => {
        setLoading(true)
        const response = await fetch(`/api/forms/${id}`)
        const body = await response.json()
        console.log(body)
        setForm(body)
        setLoading(false)
    }
    // Form ID (manually set for now)
    const formId = 1

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isDisabled) return;
        setLoading(true)
        try {
            const dataToSend = Object.entries(data).map(([name, value]) => ({ field: name, value }))
            const req = await fetch('/api/form-submissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ form: formId, submissionData: dataToSend }),
            })
            await req.json()
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchForm(formId)
    }, [formId])

    useEffect(() => {
        if (form && form.fields) {
            setIsDisabled(form.fields.some(field => 'required' in field && field.required && !data[field.name]))
        }
    }, [data, form])

    if (!form || loading) return <div className='grid grid-cols-1 min-h-[50dvh] text-secondary text-lg place-content-center'>
        <Loading />
    </div>

    return (
        <form
            className='grid grid-cols-1 gap-2 space-y-2 py-4 mx-2 space-x-2 grid-flow-row-dense text-other border-4 border-dashed border-primary p-4 rounded-lg bg-primary/10 text-center  mb-4 md:w-2/3 max-w-prose transition duration-150'
            id={formId.toString()}
            onSubmit={handleSubmit}
        >
            <h1 className='text-2xl font-body uppercase'>{form.title}</h1>
            <p className='font-display text-secondary'>Got any questions or suggestions? Fill out this form to reach out</p>
            <div className='flex flex-row flex-wrap'>
                {form.fields && form.fields.length > 0 ? form.fields.map((field) => (
                    <Field key={field.id} field={field} setData={setData} />
                )) : null}
            </div>
            <button
                className='uppercase bg-secondary p-2 rounded-lg shadow-lg not-disabled:hover:shadow-primary text-white not-disabled:hover:bg-primary not-disabled:hover:text-other disabled:bg-secondary/40 font-display mx-4 transition duration-300'
                type='submit'
                disabled={isDisabled}
            >
                {form.submitButtonLabel ?? 'Submit'}
            </button>
        </form>
    )
}

export default ContactForm