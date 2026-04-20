"use client";
import React, { useEffect, useMemo, useState } from "react";
import type { Form as FormType } from "@/payload-types";
import { setCookie } from "cookies-next/client";
import Field from "./Field";
import { useTranslations, useLocale } from "next-intl";

const ContactForm = () => {
    const t = useTranslations();
    const locale = useLocale();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<FormType | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<Record<string, any>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Form ID (manually set for now)
    const formId = 1;

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
                setIsSubmitted(true);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        let cancelled = false;

        void fetch(`/api/forms/${formId}?locale=${locale}`)
            .then((response) => response.json())
            .then((body: FormType) => {
                if (cancelled) return;
                setForm(body);
            })
            .catch((error) => {
                console.error(error);
            });

        return () => {
            cancelled = true;
        };
    }, [formId, locale]);

    return (
        <form
            className="grid grid-cols-1 gap-2 space-y-2 py-4 mx-2 space-x-2 grid-flow-row-dense text-other border-4 border-dashed border-primary p-4 rounded-lg bg-primary/10 text-center  mb-4 md:w-2/3 max-w-prose transition duration-150"
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
