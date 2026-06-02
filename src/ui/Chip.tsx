export const Chip = ({ text }: { text: string }) => {
    return (
        <div className="inline-flex items-center rounded-full bg-green-500 text-white px-3 py-1 text-sm">
            {/* online dot icon here */}
            <span>{text}</span>
        </div>
    )
}