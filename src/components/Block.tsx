export const Block: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>> = ({
    children,
    className,
    ...props
}) => {
    return (
        <div
            className={`flex flex-col items-center justify-center w-full min-h-screen font-body overflow-hidden ${className || ""}`}
            {...props}
        >
            {children}
        </div>
    );
};