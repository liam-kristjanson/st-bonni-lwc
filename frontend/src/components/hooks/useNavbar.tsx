import { useState } from "react";

export default function useNavbar() {
    const [showMenu, setShowMenu] = useState<boolean>(false);

    function handleMenuShow() {
        setShowMenu(true);
      }
    
      function handleMenuHide() {
        setShowMenu(false);
      }

      return {showMenu, handleMenuShow, handleMenuHide}
}

