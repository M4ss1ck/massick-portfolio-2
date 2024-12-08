/* eslint-disable @next/next/no-img-element */
// https://payloadcms.com/docs/admin/components#adding-styles
export default function Avatar() {
    return (
        <img
            className="rounded-full"
            src={'/images/profile.jpg'}
            width={40}
            height={40}
            alt="Profile"
            style={{
                borderRadius: '99999px',
            }}
        />
    )
}