import Image from 'next/image'

export default function Loading() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <h1 className='text-4xl animate-ping'>Loading...</h1>
        </main>
    )
}
