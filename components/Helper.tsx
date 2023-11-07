"use client"
import React, { useEffect } from 'react'
import { useStore } from '@/state/store';

/**
 * Component to set locale in state
 */
const Helper = ({ lng }: { lng: string | null }) => {
    const { setLng } = useStore()
    useEffect(() => {
        if (lng) setLng(lng)
    }, [lng, setLng])
    return (
        <></>
    )
}

export default Helper