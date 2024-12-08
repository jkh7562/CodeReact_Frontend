import useCustomLogin from "../../hooks/useCustomLogin";
import useCustomCart from "../../hooks/useCustomCart";
import CartItemComponent from "../cart/CartItemComponent";
import { useRecoilValue } from "recoil";
import { cartTotalState } from "../../atoms/cartState";

const CartComponent = () => {

    const {isLogin, loginState} = useCustomLogin()

    const { cartItems, changeCart } = useCustomCart()

    const totalValue = useRecoilValue(cartTotalState)

    return (
        <div className="w-full">
            {isLogin ?

                <div className="flex flex-col">

                    <div className="w-full flex">
                        <div className="font-extrabold text-2xl w-4/5">
                            {loginState.nickname}'s Cart
                        </div>
                        <div className="bg-orange-600 text-center text-white font-bold w-1/5 rounded-full m-1">
                            {cartItems.length}
                        </div>
                    </div>

                    <div>
                        <ul>
                            {cartItems.map( item =>
                                <CartItemComponent {...item}
                                                   key={item.cino}
                                                   changeCart ={changeCart}
                                                   email={loginState.email}/>)}
                        </ul>
                    </div>

                    <div className="m-2 text-3xl ">
                        TOTAL: {totalValue}
                    </div>
                </div>
                :
                <div></div>
            }
        </div>
    );
}

export default CartComponent;