export const Block: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-screen font-body overflow-hidden">
            {children}
        </div>
    )
}