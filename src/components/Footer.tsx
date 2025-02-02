import ContactForm from "./form/ContactForm"

const socialLinks = [
    {
        component: 'telegram',
        href: "https://t.me/m4ss1ck",
        title: "Telegram",
    },
    {
        component: 'github',
        href: "https://github.com/M4ss1ck",
        title: "GitHub",
    },
    {
        component: 'twitter',
        href: "https://twitter.com/m4ss1ck",
        title: "X",
    },
    {
        component: 'linkedin',
        href: "https://www.linkedin.com/in/m4ss1ck",
        title: "LinkedIn",
    },
]

const renderSocialIcon = (component: string) => {
    switch (component) {
        case 'github':
            return <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><mask id="lineMdGithubLoop0" width={24} height={24} x={0} y={0}><g fill="#fff"><ellipse cx={9.5} cy={9} rx={1.5} ry={1}></ellipse><ellipse cx={14.5} cy={9} rx={1.5} ry={1}></ellipse></g></mask><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path strokeDasharray={32} strokeDashoffset={32} d="M12 4c1.67 0 2.61 0.4 3 0.5c0.53 -0.43 1.94 -1.5 3.5 -1.5c0.34 1 0.29 2.22 0 3c0.75 1 1 2 1 3.5c0 2.19 -0.48 3.58 -1.5 4.5c-1.02 0.92 -2.11 1.37 -3.5 1.5c0.65 0.54 0.5 1.87 0.5 2.5c0 0.73 0 3 0 3M12 4c-1.67 0 -2.61 0.4 -3 0.5c-0.53 -0.43 -1.94 -1.5 -3.5 -1.5c-0.34 1 -0.29 2.22 0 3c-0.75 1 -1 2 -1 3.5c0 2.19 0.48 3.58 1.5 4.5c1.02 0.92 2.11 1.37 3.5 1.5c-0.65 0.54 -0.5 1.87 -0.5 2.5c0 0.73 0 3 0 3"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.35s" values="32;0"></animate></path><path strokeDasharray={10} strokeDashoffset={10} d="M9 19c-1.406 0-2.844-.563-3.688-1.188C4.47 17.188 4.22 16.157 3 15.5"><animate attributeName="d" dur="1.5s" repeatCount="indefinite" values="M9 19c-1.406 0-2.844-.563-3.688-1.188C4.47 17.188 4.22 16.157 3 15.5;M9 19c-1.406 0-3-.5-4-.5-.532 0-1 0-2-.5;M9 19c-1.406 0-2.844-.563-3.688-1.188C4.47 17.188 4.22 16.157 3 15.5"></animate><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.1s" values="10;0"></animate></path></g><rect width={8} height={4} x={8} y={11} fill="currentColor" mask="url(#lineMdGithubLoop0)"><animate attributeName="y" dur="5s" keyTimes="0;0.45;0.46;0.54;0.55;1" repeatCount="indefinite" values="11;11;7;7;11;11"></animate></rect></svg>
        case 'twitter':
            return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="currentColor"><path d="M1 2h2.5L3.5 2h-2.5zM5.5 2h2.5L7.2 2h-2.5z"><animate fill="freeze" attributeName="d" dur="0.8s" values="M1 2h2.5L3.5 2h-2.5zM5.5 2h2.5L7.2 2h-2.5z;M1 2h2.5L18.5 22h-2.5zM5.5 2h2.5L23 22h-2.5z"></animate></path><path d="M3 2h5v0h-5zM16 22h5v0h-5z"><animate fill="freeze" attributeName="d" begin="0.8s" dur="0.8s" values="M3 2h5v0h-5zM16 22h5v0h-5z;M3 2h5v2h-5zM16 22h5v-2h-5z"></animate></path><path d="M18.5 2h3.5L22 2h-3.5z"><animate fill="freeze" attributeName="d" begin="1s" dur="0.8s" values="M18.5 2h3.5L22 2h-3.5z;M18.5 2h3.5L5 22h-3.5z"></animate></path></g></svg>
        case 'linkedin':
            return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><circle cx={4} cy={4} r={2} fill="currentColor" fillOpacity={0}><animate fill="freeze" attributeName="fill-opacity" dur="0.3s" values="0;1"></animate></circle><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4}><path strokeDasharray={12} strokeDashoffset={12} d="M4 10v10"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.4s" values="12;0"></animate></path><path strokeDasharray={12} strokeDashoffset={12} d="M10 10v10"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.9s" dur="0.4s" values="12;0"></animate></path><path strokeDasharray={24} strokeDashoffset={24} d="M10 15c0 -2.76 2.24 -5 5 -5c2.76 0 5 2.24 5 5v5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.3s" dur="0.4s" values="24;0"></animate></path></g></svg>
        default:
            return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path strokeDasharray={20} strokeDashoffset={20} d="M21 5l-2.5 15M21 5l-12 8.5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.8s" values="20;0"></animate></path><path strokeDasharray={24} strokeDashoffset={24} d="M21 5l-19 7.5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.8s" values="24;0"></animate></path><path strokeDasharray={14} strokeDashoffset={14} d="M18.5 20l-9.5 -6.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.6s" values="14;0"></animate></path><path strokeDasharray={10} strokeDashoffset={10} d="M2 12.5l7 1"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.6s" values="10;0"></animate></path><path strokeDasharray={8} strokeDashoffset={8} d="M12 16l-3 3M9 13.5l0 5.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.4s" dur="0.6s" values="8;0"></animate></path></g></svg>
    }
}

export const Footer = () => {
    return (
        <footer className="flex flex-col items-center justify-center mt-auto z-20 lg:transition text-sm sm:text-lg bg-white/5 backdrop-filter backdrop-blur-lg w-full py-4">
            <ContactForm />
            <nav className="flex items-center justify-center flex-row flex-wrap space-x-2 text-secondary">
                {socialLinks.map((socialLink) => (
                    <a
                        key={socialLink.href}
                        href={socialLink.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={socialLink.title}
                        className="block p-1 text-xl transition duration-150 hover:text-primary"
                    >
                        {renderSocialIcon(socialLink.component)}
                    </a>
                ))}
            </nav>
            <p className="text-primary font-display text-sm my-4">
                &copy; 2021 - {new Date().getFullYear()} M4ss1ck
            </p>
        </footer>
    )
}