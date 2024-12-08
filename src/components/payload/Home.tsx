import React from 'react'
import { ExternalLink } from '../icons/ExternalLink'
import Link from 'next/link'

const Home = () => {
    return (
        <Link href={'/'}>Home <span><ExternalLink /></span></Link>
    )
}

export default Home