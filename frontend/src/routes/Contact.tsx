import { mdiEmail, mdiPhone } from "@mdi/js";
import HeroGraphic from "../components/HeroGraphic";
import Navbar from "../components/Navbar";
import useNavbar from "../components/hooks/useNavbar";
import Icon from "@mdi/react";

export default function Contact() {
    const { showMenu, handleMenuHide, handleMenuShow } = useNavbar();

    return (
        <>
            <div className="container">
                <Navbar
                    showMenu={showMenu}
                    menuHideHandler={handleMenuHide}
                    menuShowHandler={handleMenuShow}
                />
            </div>

            <HeroGraphic
                imageSource={"/house-lawn-cropped-2.jpg"}
                graphicText={" Contact Information"}
                iconPath={mdiPhone}
            />

            <div className="container">
                <div className="row">
                    <div className="col">
                        <p>
                            Have any questions? Feel free to reach out to one of our staff members, we would be happy 
                            to hear from you!
                        </p>

                        <hr/>

                        <h1 className="text-primary">Eric Dornez, CEO</h1>
                        
                        <p><Icon path={mdiPhone} size={0.9}/> 1 204 222 2222</p>

                        <p><Icon path={mdiEmail} size={0.9}/> ericdorneze@gmail.com</p>
                    </div>
                </div>
            </div>
        </>
    )
}