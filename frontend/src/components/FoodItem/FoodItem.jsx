import React,{useContext} from 'react';
import './FoodItem.css';
import {assets} from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({id,name,price,description,image}) => {

  const{cartItems,addToCart,removeFromCart,url}=useContext(StoreContext);
  return (
    <div className='food-item'> 
      <div className="food-item-img-container">
        <img src={url+"/images/"+image} alt="" className="food-item-image" />
        {cartItems && cartItems[id] > 0
    ? <div className='food-item-counter'>
        <img src={assets.remove_icon_red} onClick={()=>removeFromCart(id)} alt="" />
        <p>{cartItems[id]}</p>
        <img src={assets.add_icon_green} onClick={()=>addToCart(id)} alt="" />
      </div>
    : <img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} alt=""/>
}

      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt=""></img>
        </div>
      </div>
      <p className="food-item-desc">{description}</p>
      <p className="food-item-price">${price}</p>
    </div>
  )
}

export default FoodItem;