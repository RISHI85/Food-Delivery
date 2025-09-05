import { createContext,useEffect,useState } from "react";
import axios from "axios";

export const StoreContext=createContext(null);

const StoreContextProvider=({children})=>{
    const [cartItems,setCartItems]=useState({});
    const url=import.meta.env.VITE_API_URL;
    const[token,setToken]=useState("");
    const[food_list,setFoodList]=useState([])
;
const addToCart = async (itemId) => {
    setCartItems((prev = {}) => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1
    }));
    if (token) {
        await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
    }
}

    const removeFromCart= async (itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    }

    const getTotalCartAmount=()=>{
        let totalAmount=0;
        for(const item in cartItems)
        {
            if (cartItems[item]>0){
                let itemInfo=food_list.find((Product)=>(Product._id===item))
                totalAmount+=itemInfo.price*cartItems[item]
            }
            
        }
        return totalAmount;
    }

    const fetchFoodList = async()=>{
        const response = await axios.get(url+"/api/food/list")
        setFoodList(response.data.data)
    }


    const loadCartData= async (token)=>{
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItems(response.data.cartData || {});
    }
    useEffect(()=>{
        async function loadData() {
            await fetchFoodList();
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    },[])

    const contextValue={
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken

    }
    return(
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
}

export default StoreContextProvider;