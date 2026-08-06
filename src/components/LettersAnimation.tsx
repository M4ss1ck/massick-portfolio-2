const LettersAnimation = ({ title }: { title: string }) => {
    const array = [...title];
    // Mirrors the old effect, which walked the non-space letters and handed each
    // one a slightly longer duration than the last so they land staggered.
    let letterIndex = 0;

    return (
        <h1
            aria-label={title}
            className="flex absolute z-10 flex-wrap justify-center items-center text-2xl text-center uppercase md:text-5xl lg:text-7xl font-display text-primary"
        >
            {array.map((letter, index) => {
                if (letter === " ") {
                    return (
                        <span
                            key={index}
                            className="min-w-[1rem] mr-auto w-full"
                        >
                            {letter}
                        </span>
                    );
                }

                const duration = 550 + 150 * letterIndex++;
                return (
                    <span
                        key={index}
                        className="transition duration-300 hover:skew-y-12 hover:even:-skew-y-12 hover:-translate-y-16 hover:even:-translate-y-14 hover:scale-150 min-w-[1rem] cursor-default"
                        style={{
                            animation: `letter-drop ${duration}ms ease-in-out`,
                        }}
                    >
                        {letter}
                    </span>
                );
            })}
        </h1>
    );
};

export default LettersAnimation;
