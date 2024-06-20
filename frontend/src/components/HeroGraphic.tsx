import { mdiInformationOutline } from "@mdi/js";
import Icon from "@mdi/react";

interface HeroGraphicProps {
    graphicText: string;
    imageSource: string;
    iconPath: string;
}

export default function HeroGraphic(props: HeroGraphicProps) {
    const backgroundImagePath = "url('" + props.imageSource + "')"

    return (
        <div style={{
            backgroundImage: backgroundImagePath,
            backgroundPosition: "center",
            backgroundSize: "cover",
            height: "50vh"
        }}
        className="w-100 d-flex flex-column justify-content-center align-items-center mb-5">
            <h1 className="text-white text-center display-1"><Icon path={props.iconPath} size={2.0}/>{props.graphicText}</h1>
            <hr className="border border-white border-3 opacity-100 w-75"/>
        </div>
    )
}