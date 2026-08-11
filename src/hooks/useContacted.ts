"use client";
import { useSyncExternalStore } from "react";
import { deleteCookie, hasCookie, setCookie } from "cookies-next/client";

const COOKIE_NAME = "contacted";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

const listeners = new Set<() => void>();

const subscribe = (onStoreChange: () => void) => {
    listeners.add(onStoreChange);
    return () => {
        listeners.delete(onStoreChange);
    };
};

const emit = () => {
    for (const listener of listeners) listener();
};

const getSnapshot = () => hasCookie(COOKIE_NAME);
const getServerSnapshot = () => false;

export const markContacted = () => {
    setCookie(COOKIE_NAME, "true", { maxAge: THIRTY_DAYS });
    emit();
};

export const clearContacted = () => {
    deleteCookie(COOKIE_NAME);
    emit();
};

export const useContacted = () =>
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
