import { useTranslations } from "next-intl";
import {
    CONTACT_FORM_CLASS_NAME,
    CONTACT_FORM_CONTROL_CLASS_NAME,
} from "./contactFormStyles";

const fieldClassName = "flex flex-col gap-2 p-4 items-start";

export default function ContactFormFallback() {
    const t = useTranslations();

    return (
        <div aria-hidden="true" className={CONTACT_FORM_CLASS_NAME}>
            <h1 className="text-2xl font-body uppercase">
                {t("Contact Form")}
            </h1>
            <p className="font-display text-secondary">
                {t(
                    "reach out request",
                )}
            </p>
            <div className="flex flex-row flex-wrap font-display">
                <div className={fieldClassName} style={{ width: "50%" }}>
                    <span>{t("Email")}</span>
                    <input
                        disabled
                        tabIndex={-1}
                        className={CONTACT_FORM_CONTROL_CLASS_NAME}
                    />
                </div>
                <div className={fieldClassName} style={{ width: "50%" }}>
                    <span>{t("Name")}</span>
                    <input
                        disabled
                        tabIndex={-1}
                        className={CONTACT_FORM_CONTROL_CLASS_NAME}
                    />
                </div>
                <div className={fieldClassName} style={{ width: "100%" }}>
                    <span>&nbsp;</span>
                    <textarea
                        disabled
                        tabIndex={-1}
                        className={CONTACT_FORM_CONTROL_CLASS_NAME}
                        style={{ resize: "none" }}
                    />
                </div>
            </div>
            <button
                disabled
                tabIndex={-1}
                type="button"
                className="uppercase bg-secondary p-2 rounded-lg shadow-lg not-disabled:hover:shadow-primary text-white not-disabled:hover:bg-primary not-disabled:hover:text-other disabled:bg-secondary/40 font-display mx-4 transition duration-300"
            >
                {t("Submit")}
            </button>
        </div>
    );
}
