interface ServerMessageContainerProps {
    message: string,
    variant: "success" | "danger"
}

export default function ServerMessageContainer(props: ServerMessageContainerProps) {
    return (
        <p className={"text-center fw-bold text-" + props.variant}>
            {props.message}
        </p>
    )
}