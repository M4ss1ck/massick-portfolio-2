"use client";
import React, { useMemo, useState, useSyncExternalStore } from "react";
import { hasCookie, setCookie } from "cookies-next/client";
import Field from "./Field";
import { useTranslations } from "next-intl";
import { useForm } from "@/hooks/useForm";
import type { Form as FormType } from "@/payload-types";
import { CONTACT_FORM_CLASS_NAME } from "./contactFormStyles";

const subscribeToNothing = () => () => {};
const readContactedCookie = () => hasCookie("contacted");
const noContactedCookie = () => false;

const ContactForm = ({ initialForm }: { initialForm?: FormType }) => {
    const t = useTranslations();
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<Record<string, any>>({});
    const [justSubmitted, setJustSubmitted] = useState(false);
    const hasContacted = useSyncExternalStore(
        subscribeToNothing,
        readContactedCookie,
        noContactedCookie,
    );
    const isSubmitted = justSubmitted || hasContacted;

    // Form ID (manually set for now)
    const formId = 1;
    const { form } = useForm(formId, initialForm);

    const isDisabled = useMemo(() => {
        if (!form?.fields) return false;

        return form.fields.some((field) => {
            if (!("required" in field) || !field.required || !("name" in field))
                return false;
            return !data[field.name];
        });
    }, [data, form]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isDisabled) return;
        setLoading(true);
        try {
            const dataToSend = Object.entries(data).map(([name, value]) => ({
                field: name,
                value,
            }));
            const req = await fetch("/api/form-submissions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    form: formId,
                    submissionData: dataToSend,
                }),
            });
            const res = await req.json();
            if (res) {
                setCookie("contacted", "true");
                setJustSubmitted(true);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <form
            className={CONTACT_FORM_CLASS_NAME}
            id={formId.toString()}
            onSubmit={handleSubmit}
        >
            {!isSubmitted ? (
                <>
                    <h1 className="text-2xl font-body uppercase">
                        {t("Contact Form")}
                    </h1>
                    <p className="font-display text-secondary">
                        {t(
                            "Got any questions or suggestions? Fill out this form to reach out",
                        )}
                    </p>
                    <div className="flex flex-row flex-wrap font-display">
                        {form?.fields && form.fields.length > 0
                            ? form.fields.map((field) => (
                                <Field
                                    key={field.id}
                                    field={field}
                                    setData={setData}
                                />
                            ))
                            : null}
                    </div>
                    <button
                        className="uppercase bg-secondary p-2 rounded-lg shadow-lg not-disabled:hover:shadow-primary text-white not-disabled:hover:bg-primary not-disabled:hover:text-other disabled:bg-secondary/40 font-display mx-4 transition duration-300"
                        type="submit"
                        disabled={isDisabled || loading}
                    >
                        {form?.submitButtonLabel ?? t("Submit")}
                    </button>
                </>
            ) : (
                <p className="text-2xl font-display uppercase">
                    {t("Thank you for your feedback!")}
                </p>
            )}
        </form>
    );
};

export default ContactForm;
