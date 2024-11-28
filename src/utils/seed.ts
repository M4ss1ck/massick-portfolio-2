import type { Payload } from 'payload'
import dayjs from 'dayjs'

export const seed = async (payload: Payload) => {
    for (const tag of tags) {
        await payload.create({
            collection: 'tags',
            data: { name: tag },
        })
    }

    // fetch all tags
    const allTags = await payload.find({
        collection: 'tags',
    })

    const projectsWithTags = projects.map((project) => {
        const projectTags = project.tags.map((tagName) => {
            const tag = allTags.docs.find((tag) => tag.name === tagName)
            return tag?.id
        }).filter(tag => typeof tag !== 'undefined')

        return {
            ...project,
            tags: projectTags,
        }
    })

    for (const project of projectsWithTags) {
        await payload.create({
            collection: 'projects',
            data: project,
        })
    }
}

const tags = [
    "Gatsby",
    "Tailwind CSS",
    "Markdown",
    "TypeScript",
    "HTML",
    "JavaScript",
    "DeltaChat",
    "webxdc",
    "Game",
    "React",
    "Redux",
    "phaser3",
    "Vite",
    "SCSS",
    "Telegraf",
    "NodeJS",
    "Telegram Bot",
    "CSS",
    "Telebot",
    "NextJS"
]

const projects = [
    {
        url: "https://github.com/M4ss1ck/massick-portfolio",
        title: "Mi portafolio (old)",
        description:
            "Página web creada con GatsbyJS usando Markdown para las publicaciones y TailwindCSS para los estilos. Soporte para modo oscuro y múltiples idiomas.",
        tags: ["Gatsby", "Tailwind CSS", "Markdown", "TypeScript"],
        demo: "https://massick.is-a.dev/",
        publishedDate: dayjs("2024-02").toISOString(),
        isFavorite: true
    },
    {
        url: "https://github.com/M4ss1ck/anime-bot",
        title: "Anime bot",
        description: "Search for anime in AniList, make your own list, schedule reminders and many more through Telegram.",
        tags: ["TypeScript"],
        demo: "https://t.me/anim3robot",
        publishedDate: dayjs("2023-07").toISOString(),
        isFavorite: true
    },
    {
        url: "https://github.com/M4ss1ck/thunderbird-plugin",
        title: "Daily Report Thunderbird plugin",
        description: "Store commonly used values for To, CC and Subject fields.",
        tags: ["HTML", "JavaScript"],
        publishedDate: dayjs("2023-06").toISOString(),
        isFavorite: true
    },
    {
        url: "https://github.com/M4ss1ck/gatsby-cv-maker",
        title: "CV maker",
        description: "Crear un hermoso CV a partir de un formulario.",
        tags: ["Gatsby", "Tailwind CSS", "TypeScript"],
        demo: "https://cool-cv-maker.netlify.app/",
        publishedDate: dayjs("2022-06").toISOString(),
        isFavorite: true
    },
    {
        url: "https://github.com/DeltaZen/webxdc-chain-reaction",
        title: "Chain Reaction",
        description: "Version of popular Chain Reaction game for Delta Chat",
        tags: ["DeltaChat", "webxdc", "game", "typescript", "React", "Redux"],
        publishedDate: dayjs("2022-11").toISOString(),
        isFavorite: true
    },
    {
        url: "https://github.com/DeltaZen/webxdc-bejeweled",
        title: "Dejeweled",
        description: "Bejeweled board game clon for Delta Chat",
        tags: ["DeltaChat", "webxdc", "game", "typescript", "phaser3"],
        publishedDate: dayjs("2022-09").toISOString(),
        isFavorite: true
    },
    {
        url: "https://github.com/DeltaZen/webxdc-c4",
        title: "DeltaConnect",
        description: "Connect 4 board game clon for Delta Chat",
        tags: ["DeltaChat", "webxdc", "game", "typescript"],
        publishedDate: dayjs("2022-08").toISOString(),
        isFavorite: true
    },
    {
        url: "https://github.com/DeltaZen/webxdc-sudoku",
        title: "Sudoku",
        description: "Sudoku game with scoreboard to compete in Delta Chat groups with friends!",
        tags: ["DeltaChat", "webxdc", "game", "TypeScript"],
        publishedDate: dayjs("2022-07").toISOString(),
        isFavorite: true
    },
    {
        url: "https://github.com/DeltaZen/webxdc-color-lines",
        title: "Color Lines",
        description: "Color Lines (a.k.a. WinLines or WinLinez) game to compete with friends in groups on Delta Chat.",
        tags: ["DeltaChat", "webxdc", "game"],
        publishedDate: dayjs("2022-07").toISOString(),
        isFavorite: true
    },
    {
        url: "https://github.com/M4ss1ck/gatsby-gamebook",
        title: "Gamebook",
        description: "Make your own gamebook modifying a single file.",
        tags: ["Gatsby", "TypeScript"],
        demo: "https://gamebook.gatsbyjs.io/",
        publishedDate: dayjs("2022-06").toISOString(),
        isFavorite: true
    },
    {
        url: "https://github.com/DeltaZen/webxdc-exquisite-corpse",
        title: "Exquisite Corpse",
        description:
            "A social creative writing game for Delta Chat made using React + TypeScript + TailwindCSS + Vite",
        tags: ["React", "Tailwind CSS", "TypeScript", "Vite", "webxdc", "game"],
        publishedDate: dayjs("2022-06").toISOString(),
    },
    {
        url: "https://github.com/DeltaZen/webxdc-snake",
        title: "Snake game",
        description: "Snake game for Delta Chat made using HTML + CSS + JS + Vite",
        tags: ["HTML", "CSS", "JavaScript", "Vite", "webxdc", "game"],
        publishedDate: dayjs("2022-06").toISOString(),
    },
    {
        url: "https://github.com/DeltaZen/rainbow.xdc",
        title: "Rainbow game",
        description:
            "A color picker game for Delta Chat made using React + SCSS + Vite",
        tags: ["React", "SCSS", "Vite", "webxdc", "game"],
        publishedDate: dayjs("2022-06").toISOString(),
    },
    {
        url: "https://github.com/DeltaZen/webxdc-whack-a-ninja",
        title: "Whack-A-Ninja: Whack-a-mole clon for Delta Chat",
        description:
            "A Whack-A-Mole clon for playing in Delta Chat made with only HTML + CSS + Javascript",
        tags: ["HTML", "CSS", "JavaScript", "webxdc", "game"],
        publishedDate: dayjs("2022-06").toISOString(),
    },
    {
        url: "https://github.com/DeltaZen/webxdc-math-battle",
        title: "Math Battle game for Delta Chat",
        description:
            "Math Battle game for Delta Chat made with only HTML + CSS + Javascript",
        tags: ["HTML", "CSS", "JavaScript", "webxdc", "game"],
        publishedDate: dayjs("2022-06").toISOString(),
    },
    {
        url: "https://github.com/M4ss1ck/webxdc-react-hello-world",
        title: 'React "hello world!" app for Delta Chat',
        description:
            "A template for creating webxdc apps using react and Tailwind CSS.",
        tags: ["React", "Tailwind CSS", "Vite"],
        publishedDate: dayjs("2022-05").toISOString(),
    },
    {
        url: "https://github.com/M4ss1ck/longPollRobot",
        title: "Long Poll Robot",
        description:
            "Envía encuestas con más de 10 opciones y serán divididas equitativamente usando el comando /poll",
        tags: ["NodeJS", "Telegram Bot", "Telegraf"],
        publishedDate: dayjs("2022-05").toISOString(),
    },
    {
        url: "https://github.com/M4ss1ck/tg-telegraf-bot",
        title: "WastingBot (remix)",
        description: "Telegram bot using nodejs and Telegraf.js",
        tags: ["NodeJS", "Telegram Bot", "Telegraf"],
        demo: "https://t.me/massickRemixBot",
        publishedDate: dayjs("2022-06").toISOString(),
    },
    {
        url: "https://github.com/M4ss1ck/ciec-frontend-gatsby",
        title: "CIEC website",
        description:
            "Página web del Centro de Investigaciones de Ecosistemas Costeros (CIEC).",
        tags: ["Gatsby", "Tailwind CSS"],
        publishedDate: dayjs("2022-01").toISOString(),
        isFavorite: true
    },
    {
        url: "https://github.com/M4ss1ck/wastingBot",
        title: "WastingBot",
        description: "Telegram bot using nodejs and telebot",
        tags: ["NodeJS", "Telegram Bot", "Telebot"],
        publishedDate: dayjs("2022-02").toISOString(),
    },
    {
        url: "https://github.com/M4ss1ck/nextjs-blog-template",
        title: "Next.js Blog Template",
        description: "Blog template using Next.js and TailwindCSS",
        tags: ["Next.js", "Tailwind CSS"],
        publishedDate: dayjs("2021-11").toISOString(),
    },
]