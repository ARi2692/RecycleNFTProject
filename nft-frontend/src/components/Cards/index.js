import "./card.css";
import { ethers } from "ethers"

const Cards = ({ index, item, marketplace }) => {
    
  const buyMarketItem = async (item) => {
    await (
      await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })
    ).wait();
    alert("Successfully bought your NFT!");
    window.location.replace("/");
  };

  return (
    <div className="productList">
      <div key={item.id} className="productCard">
        <img src={item.image} alt="product-img" className="productImage"></img>
        <div className="productCard__content">
          <h4 className="productName">{item.name}</h4>
          <p>{item.description}</p>
          { index===0 &&
            <button onClick={() => buyMarketItem(item)} className="button-buy">
            Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
          </button>
          }          
        </div>
      </div>
    </div>
  );
};

export default Cards;
