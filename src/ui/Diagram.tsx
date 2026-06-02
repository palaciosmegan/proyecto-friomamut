interface DiagramProps {
    title: string,
    data: string,
    image: string
}

export const Diagram = ({ title, data, image }: DiagramProps) => {
    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            <p>{data}</p>
            <img src={image} alt={title} className="w-full h-auto mb-4" />
        </div>
    )
}