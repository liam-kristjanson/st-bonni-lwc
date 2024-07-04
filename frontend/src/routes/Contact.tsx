import { mdiEmail, mdiFacebook, mdiInstagram, mdiPhone, mdiTwitter } from "@mdi/js";
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
                <div className="row d-flex justify-content-center mb-4">
                    <div className="col-lg-8">
                        <p>
                            Have any questions? Feel free to reach out to one of our staff members, we would be happy 
                            to hear from you!
                        </p>

                        <hr/>

                        <h1 className="text-primary">St. Boniface Lawn and Window Care</h1>
                        
                        <p><Icon path={mdiPhone} size={0.9}/> 1 204 222 2222</p>

                        <p><Icon path={mdiEmail} size={0.9}/> ericdorneze@gmail.com</p>

                        <hr/>

                        <h1 className="text-primary">Social Media</h1>

                        <p>
                            Check out our social channels to see some of the wornderful yards we've worked on, and keep
                            up to date with the latest offers and promotions from St. Boniface Lawn and Window Care!
                        </p>
                    </div>
                </div>

                <div className="row justify-content-center mb-5">
                    <div className="col-4 col-md-3 col-lg-2">
                        <a className="link-primary d-flex align-items-center flex-column" href="#">
                            <Icon path={mdiInstagram} size={2}/>
                            <div className="text-align-center">Instagram</div>
                        </a>
                    </div>

                    <div className="col-4 col-md-3 col-lg-2 d-flex align-items-center flex-column">
                        <a className="link-primary d-flex align-items-center flex-column" href="#">
                            <Icon path={mdiFacebook} size={2}/>
                            <div className="text-align-center">Facebook</div>
                        </a>
                    </div>

                    <div className="col-4 col-md-3 col-lg-2 d-flex align-items-center flex-column">
                        <a className="link-primary d-flex align-items-center flex-column" href="#">
                            <Icon path={mdiTwitter} size={2}/>
                            <div className="text-align-center">Twitter</div>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}