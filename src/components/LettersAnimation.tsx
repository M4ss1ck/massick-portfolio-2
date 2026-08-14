const LettersAnimation = ({ title }: { title: string }) => {
    const array = [...title];
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
                            className="min-w-4 mr-auto w-full"
                        >
                            {letter}
                        </span>
                    );
                }

                const delay = 35 * letterIndex++;
                return (
                    <span
                        key={index}
                        className="transition duration-300 hover:skew-y-12 hover:even:-skew-y-12 hover:-translate-y-16 hover:even:-translate-y-14 hover:scale-150 min-w-4 cursor-default"
                        style={{
                            animation: `letter-drop 500ms ease-in-out ${delay}ms backwards`,
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
